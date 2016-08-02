require 'json'
package = JSON.parse(File.read("package.json"))

Pod::Spec.new do |s|

  s.name           = package["name"]
  s.version        = package["version"]
  s.summary        = package['description']
  s.author         = { "devfd" => "hello@devfd.me" }
  s.license        = package["license"]
  s.homepage       = package["homepage"]
  s.platform       = :ios, "7.0"
  s.source         = { :git => "https://github.com/devfd/react-native-geocoder.git", :tag => "v#{s.version}" }
  s.source_files   = 'ios/RNGeocoder/*.{h,m}'
  s.preserve_paths = "**/*.js"
  s.dependency 'React'

end
