require 'test_helper'

class PhotosControllerTest < ActionController::TestCase
  test "should get all" do
    get :all
    assert_response :success
  end

  test "should get album" do
    get :album
    assert_response :success
  end

  test "should get photo" do
    get :photo
    assert_response :success
  end

end
