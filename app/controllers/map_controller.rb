require 'rest-client'
require 'pg'
require 'rgeo/geo_json'
require 'json'

class MapController < ApplicationController

  def get_conn
    host      = ENV['MAPPY_DATA_DB_HOST']
    dbname    = ENV['MAPPY_DATA_DB']
    port      = ENV['MAPPY_DATA_DB_PORT']
    user      = ENV['MAPPY_DATA_DB_USER']
    password  = ENV['MAPPY_DATA_DB_PASSWORD']
    
    conn = PGconn.open(
      :host => host,
      :dbname => dbname,
      :port => port,
      :user => user,
      :password => password
    )
    return conn
  end


  def check_region

    lat = params[:lat].to_f
    lng = params[:lng].to_f

    conn = get_conn

    # insert x,y into table
    insert = "insert into user_point (name, geom) VALUES ('', ST_GeomFromText('Point(" + lng.to_s + " " + lat.to_s + ")', 4269)) RETURNING id"
    result = conn.query(insert)

    # determine if x,y intersects the states layer
    select = "SELECT tl_2016_us_state.gid FROM tl_2016_us_state, user_point WHERE user_point.id = $1 AND ST_Intersects(user_point.geom, tl_2016_us_state.geom);"
    result = conn.query(select, [result[0]['id']])
puts "USA..."
    if (result.count > 0) 
      render :json => { result: true } 
    else 
      render :json => { result: false } 
    end

  end


  #
  # usa map is broken up into 4 regions, determine which region to use
  #
  def getRegion(lat, lng)
    if (lng <= -100 and lat <= 36)      
      return "southwest"
    elsif (lng <= -100 and lat >= 36)
      return "northwest"
    elsif (lng >= -100 and lat >= 36)
      return "northeast"
    elsif (lng >= -100 and lat <= 36)
      return "southeast"
    else
      return false
    end
  end


  def do_r360_iso(latitude_y, longitude_x, time, region, insert_table)

    r360_key = ENV['MAPPY_DATA_R360_KEY']

    r360_url_string = "https://service.route360.net/na_" +
                  region.to_s + "/v1/polygon?cfg={'sources':[{'lat':" + 
                  latitude_y.to_s + ",'lng':" + longitude_x.to_s + 
                  ",'id':'Mappy','tm':{'car':{}}}],'polygon':" +
                  "{'serializer':'geojson','srid':'4326'," +
                  "'values':[" + time.to_s + "]}}&key=" + r360_key.to_s
    
    # r360 rest call
    response_r360 = RestClient.get r360_url_string

    # polygon geometry and area (sq metres)
    geometry  = JSON.parse(response_r360)['data']['features'][0]['geometry']
    area      = JSON.parse(response_r360)['data']['features'][0]['properties']['area']

    puts "R360 Geom = " + geometry["type"].to_s

    # stringify JSON object then a couple of minor mainpulations for preparing to use in a db insert statement
    isochrone_r360 = geometry.to_s.gsub('"', '\'').gsub('=>', ':')

    # insert query string
    db_insert = "insert into user_multi_polygon (geom) VALUES (ST_SetSRID(ST_GeomFromGeoJSON($1), 4269)) RETURNING id"

    conn = get_conn

    result_db_insert = conn.query(db_insert, [isochrone_r360])
    puts "iso_r360 inserted..."

    conn.close

    # inserted row number
    row   = result_db_insert.first['id']

    return_hash = { :success          => true,
                    :table_row_number => row,
                    :geometry         => geometry,
                    :area             => area
                  }

    return JSON.generate(return_hash)
  end


  def do_buffer(buffer, row, table_name_source, insert_table)
    
    # create buffer on geom
    db_buffer = 'Select ST_Buffer(geom, $1) from ' + table_name_source.to_s + ' where id = $2'

    conn = get_conn
    result_db_buffer = conn.query(db_buffer, [buffer, row])

    # retrieve buffered geometry
    geometry = result_db_buffer[0]['st_buffer']

    db_insert = 'insert into ' + insert_table.to_s + ' (geom) Values($1) RETURNING id'

    result_db_insert = conn.query(db_insert,[geometry])
    puts "iso_buffer inserted..."

    conn.close

    # inserted row number
    row   = result_db_insert.first['id']

    return_hash = { :success          => true,
                    :table_row_number => row
                  }
    
    return JSON.generate(return_hash)

  end


  def create_isochrone

    latitude_y = params[:latitude].to_f
    longitude_x = params[:longitude].to_f
    time = params[:time].to_i     # in seconds

    # determine region of usa using x,y
    region = getRegion(latitude_y, longitude_x)

    if (region)

      # create isochrone using r360
      result_r360 = do_r360_iso(latitude_y, longitude_x, time, region, "user_multi_polygon")
      parsed = JSON.parse(result_r360.to_s)

      if parsed["success"] 

        geometry  = parsed["geometry"]["coordinates"]
        area      = parsed["area"]
        row       = parsed["table_row_number"]

        result_buffer = do_buffer(0.0009, row, "user_multi_polygon", "user_polygon")

        parsed = JSON.parse(result_buffer.to_s)

        if parsed["success"]

          # spatial select to calculate demographics
          row         = parsed["table_row_number"]
          table_name  = "user_polygon"

          db_query = 'select sum(housing10) housing10,' + 
                       'sum(st_area(st_intersection(' + table_name.to_s + '.geom, tabblock_2010_pophu.geom))/st_area(tabblock_2010_pophu.geom) * housing10) as housing_calc, ' +
                       'sum(pop10) as pop10,' +
                       'sum(st_area(st_intersection(' + table_name.to_s + '.geom, tabblock_2010_pophu.geom))/st_area(tabblock_2010_pophu.geom) * pop10) as pop_calc ' + 
                       'from tabblock_2010_pophu, ' + table_name.to_s + ' where ' + table_name.to_s + '.id = $1 and ST_INTERSECTS(' + table_name.to_s + '.geom, tabblock_2010_pophu.geom)'

          conn = get_conn
          result_db_query = conn.query(db_query, [row])

          db_query_buffer = 'SELECT substring(left(St_astext(geom),-2),10) FROM user_polygon where id=$1;'
          result_db_query_buffer = conn.query(db_query_buffer, [row])

          conn.close

          coordinates_string = result_db_query_buffer[0]['substring']
          coordinates_array = coordinates_string.split(",")

          render :json => {
            success: true,
            coordinates: geometry,
            buffer: coordinates_array,
            area: area,
            housing: result_db_query[0]['housing_calc'],
            pop:     result_db_query[0]['pop_calc']
          }
        end

      end
          
    else
      render :json => {
        success: false,
      }
    end
  end
end

