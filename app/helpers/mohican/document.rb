require 'active_support/concern'

module Mohican::Document
  extend ActiveSupport::Concern

  module ClassMethods
    def include_into_json(method, label: nil)
      additinial_json_fields << { method: method, name: label || field_symbol }
    end

    def additinial_json_fields
      @additinial_json_fields ||= []
    end
  end

  def as_json(options = nil)
    j = super.as_json(options)
    j[:_mnid] = id.to_s
    j.reject! { |k, _v| k.to_s.starts_with? '__' }
    self.class.additinial_json_fields.each { |a| j[a[:name]] = send a[:method] }
    j
  end
end
