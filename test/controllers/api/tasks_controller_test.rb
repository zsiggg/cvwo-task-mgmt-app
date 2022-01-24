require "test_helper"

class Api::TasksControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get api_tasks_create_url
    assert_response :success
  end

  test "should get read" do
    get api_tasks_read_url
    assert_response :success
  end

  test "should get update" do
    get api_tasks_update_url
    assert_response :success
  end

  test "should get delete" do
    get api_tasks_delete_url
    assert_response :success
  end

  test "should get show" do
    get api_tasks_show_url
    assert_response :success
  end
end
