# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
users = [
    ["abc@def.gh", "12345678", 1],
    ["boy@def.gh", "12345678", nil],
    ["dude@gmail.com", "12345678", 3],
    ["cat@gmail.com", "12345678", nil],
    ["noob@yahoo.com", "12345678", nil]
]

users.each do |user|
  User.create(email: user[0], password: user[1], password_confirmation: user[1], open_bottle_id: user[2])
end

bottles = [
    ["Hello world. My name is ruby and I like rails.", 2, true, "DHH", nil, nil],
    ["Hi. I have been stuck on this island for 20 days now. There is food and water, but no internet. Please send help.",
    1, false, "IslandIguana", "131", "80"],
    ["Lorem ipsum blah blah I dont know.", 1, true, "Bored man", "130", "100"],
    ["Have you ever wondered why the sea is blue?", 4, false, "Curious Cat", nil, nil],
]

bottles.each do |bottle|
  Bottle.create(message: bottle[0], user_id: bottle[1], opened: bottle[2],
                author: bottle[3], latitude: bottle[4], longitude: bottle[5])
end

messages = [
    ["Hey I have no idea who you are, but you are an Iguana. Im not helping you. Someone else pls.",
     5, 2, "SelfishShellfish", nil, nil],
    ["Cos the fishes go blu blu blu?", 1, 4, "Smart boy", "56", "73"],
    ["Yo dude ignore the shellfish. Heres a phone with a sim card.", 3, 2, "HelpfulHorse", "81", "81"],
    ["LOL U STOOPID BRO? HOWS HE GETTING THIS BOTTLE BACK?", 4, 2, "Troll King", "24", "33"]
]

messages.each do |message|
  Message.create(message: message[0], user_id: message[1], bottle_id: message[2],
                 author: message[3], latitude: message[4], longitude: message[5])
end