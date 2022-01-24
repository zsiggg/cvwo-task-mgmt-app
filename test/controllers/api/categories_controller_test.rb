require "test_helper"

class Api::CategoriesControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get api_categories_create_url
    assert_response :success
  end

  test "should get read" do
    get api_categories_read_url
    assert_response :success
  end

  test "should get update" do
    get api_categories_update_url
    assert_response :success
  end

  test "should get delete" do
    get api_categories_delete_url
    assert_response :success
  end
end
