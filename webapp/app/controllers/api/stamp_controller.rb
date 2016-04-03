require 'stamp'
class Api::StampController < ApplicationController

  skip_before_filter :verify_authenticity_token

  # time:int
  # card_id:string
  # device_name:string
  def index
    reader_token = request.env["HTTP_ACCESS_TOKEN"]
    if Token.where(token: reader_token).count == 0
      render :json=>{status: "error", message: "This reader is not registered"}
      return
    end

    remote_ip = request.env["HTTP_X_FORWARDED_FOR"] || request.remote_ip
    time_sec = params["time"]
    card_id = params["card_id"]
    begin
      student = Student.find_by(card_id: card_id)
    rescue
      begin
        student = Student.find_by(card_id: card_id.upcase)
      rescue
      end
    end
    if student != nil
      device_name = params["device_name"]
      time = Time.at(time_sec.to_i)
      Stamp::write(time, student.id, device_name, remote_ip)
      render :json => {status: "success", name: "#{student.name[:family_name]} #{student.name[:first_name]}" }
    else
      render :json => {status: "error", message: "This card(#{card_id}) is not registered." }
    end

  end
end
