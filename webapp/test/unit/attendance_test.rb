require 'minitest/unit'
require 'attendance'

MiniTest::Unit.autorun

class TestAttendance < Minitest::Unit::TestCase

  def setup
    @store_dir = Webapp::Application::config.attendance_store_dir
    FileUtils.remove_entry(@store_dir)
  end

  def test_write_read
    t = Time.new(2008, 6, 21, 13, 30, 0, "+09:00")
    Attendance::write(t, "student2", "device_2", "127.0.0.3")
    Attendance::write(t + 60, "student1", "device_1", "127.0.0.1")
    Attendance::write(t + 120, "student2", "device_1", "127.0.0.2")

    history = Attendance::read(2008, 6)
    assert_equal 3, history.length

    history = Attendance::read(2008, 6, "student1")
    assert_equal 1, history.length
    s1 = history[0]
    assert_equal "student1", s1[:student_id]
    assert_equal "device_1", s1[:device_name]
    assert_equal "127.0.0.1", s1[:device_ip]
    assert_equal (t+60).to_s, s1[:time]



    history = Attendance::read(2008, 6, "student2")
    assert_equal 2, history.length

    history = Attendance::read(2008, 6, "student3")
    assert_equal 0, history.length

  end
end
