class Hash
  def random
    random_group = rand(1..10)
    current_sum = 0
    keys.each do |key|
      current_sum += key.to_s.to_i
      return rand self[key] if random_group <= current_sum
    end
    # return something is someone defined it wrong
    rand values.first
  end
end

def random(c)
  @class_hash ||= {}
  @class_hash[c] = c.all.to_ary if @class_hash[c].nil?
  @class_hash[c][rand(0..@class_hash[c].count - 1)]
end
