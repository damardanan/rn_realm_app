const Realm = require('realm');
const CarSchema = {
  name: 'Car',
  properties: {
    make: 'string',
    model: 'string',
    description: 'string',
    miles: {type: 'int', default: 0},
    persons: 'Person',
  },
};
const PersonSchema = {
  name: 'Person',
  properties: {
    name: 'string',
    userName: 'string',
    password: 'string',
    picture: 'data?', // optional property
  },
};
Realm.Sync.User.login(
  'https://car-list.us1a.cloud.realm.io',
  Realm.Sync.Credentials.usernamePassword('Fahmi', 'Fahmi'),
).then(user => {
  let config = {
    schema: [CarSchema, PersonSchema],
    sync: {
      user: user,
      url: `realms://car-list.us1a.cloud.realm.io/aRealm`,
    },
  };
  Realm.open(config).then(realm => {
    let results = realm.objects('Car');
    console.log(results);
  });
});
