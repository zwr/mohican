# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require "mohican/version"

Gem::Specification.new do |s|
  s.name        = 'mohican'
  s.version     = Mohican::VERSION.dup
  s.platform    = Gem::Platform::RUBY
  s.licenses    = ['MIT']
  s.summary     = 'Mohican is very fast!'
  s.email       = 'zeljko@z-ware.fi'
  s.homepage    = 'https://github.com/zwr/mohican'
  s.description = 'Mohican is AngularJS front end plantform that is fast to work with.'
  s.authors     = ['Zeljko Milojkovic', 'Aleksandar Djindjic']

  s.files         = `git ls-files`.split("\n")
  # s.test_files    = `git ls-files -- test/*`.split("\n")
  s.require_paths = ['lib']
  s.required_ruby_version = '>= 2.2.0'

  s.add_dependency('bootstrap-sass', '~> 3.2.0')
  s.add_dependency('bootstrap_form', '~> 2.3.0')
  s.add_dependency('angularjs-rails', '~> 1.4.3')
  s.add_dependency('angular-rails-templates', '~> 0.2.0')
  s.add_dependency('angular-ui-bootstrap-rails', '~> 0.13.0')
  s.add_dependency('angular_rails_csrf', '~> 1.0.3')
  s.add_dependency('rails-assets-angular-devise', '~> 1.1.0')
end