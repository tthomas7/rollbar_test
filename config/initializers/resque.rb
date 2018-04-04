# An initializer t
REDIS.with do |connection|
  Resque.redis = connection
end
