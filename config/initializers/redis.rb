# frozen_string_literal: true

require 'connection_pool'
REDIS = ConnectionPool.new(size: 10) do
  redis = Redis.new url: ENV['REDIS_URL']
  Redis::Namespace.new('Checker-Cruncher', redis: redis)
end
