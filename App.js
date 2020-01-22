/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {SERVER_URL, SERVER_ADDRESS} from './constants';

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
    // cars: 'Car[]', // a list of Cars && data cannot be optional
    picture: 'data?', // optional property
  },
};

const Login = props => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{padding: 20, borderRadius: 5, width: '50%'}}>
        <TextInput
          placeholder={'username'}
          onChangeText={text => props.username(text)}
        />
        <TextInput
          placeholder={'password'}
          onChangeText={text => props.password(text)}
        />
        <Button title={'Login'} onPress={props.onGoHome} />
        <Button title={'Register'} onPress={props.onGoRegister} />
      </View>
    </View>
  );
};

const Register = props => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{padding: 20, borderRadius: 5, width: '50%'}}>
        <TextInput placeholder={'name'} onChangeText={props.name} />
        <TextInput placeholder={'username'} onChangeText={props.username} />
        <TextInput placeholder={'password'} onChangeText={props.password} />
        <Button title={'Register'} onPress={props.onGoLogin} />
        {/* <Button title={'Back'} onPress={props.onLogin} /> */}
      </View>
    </View>
  );
};

const Home = props => {
  return (
    <View style={{flex: 1}}>
      <View style={{...styles.container, paddingVertical: 50}}>
        <View>
          <TextInput placeholder={'Make'} onChangeText={props.make} />
          <TextInput placeholder={'Model'} onChangeText={props.model} />
          <TextInput
            placeholder={'Description'}
            onChangeText={props.description}
          />
          <Button title="ADD" onPress={props.add} />
        </View>
        <View style={{flex: 1}}>
          <ScrollView>
            {props.data.map((item, i) => {
              return (
                <View
                  style={{
                    elevation: 2,
                    marginVertical: 5,
                    borderRadius: 5,
                    padding: 20,
                    backgroundColor: 'white',
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.2,
                    marginHorizontal: 5,
                  }}
                  key={i}>
                  <View>
                    <Image
                      source={{
                        uri: item.description,
                      }}
                      style={{height: 100, width: 200}}
                    />
                    <Text>{item.make}</Text>
                    <Text>{item.model}</Text>
                    <TouchableOpacity
                      style={{marginTop: 10}}
                      onPress={() => props.delete(item)}>
                      <Text style={{color: 'purple'}}>DELETE</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};
const App: () => React$Node = () => {
  let [realm, setRealm] = useState();
  // Realm.open({schema: [CarSchema, PersonSchema]}),
  let [cars, setCars] = useState([]);
  let [timer, setTimer] = useState();
  let [dura, setDura] = useState(0);

  let [isLogedIn, setIsLogedIn] = useState(true);
  let [isRegister, setIsRegister] = useState(false);

  let [name, setName] = useState();
  let [userNameRegis, setUsernameRegis] = useState();
  let [passRegister, setPassRegister] = useState();
  let [userNameLogin, setUsernameLogin] = useState();
  let [passwordLogin, setPasswordLogin] = useState();

  let [make, setMake] = useState();
  let [model, setModel] = useState();
  let [description, setDescription] = useState();

  let [userData, setUserData] = useState();
  let [carList, setCarList] = useState([]);

  // useEffect(() => {
  //   Realm.open({
  //     schema: [{name: 'Dog', properties: {name: 'string'}}],
  //   }).then(realms => {
  //     realms.write(() => {
  //       realms.create('Dog', {name: 'Rex'});
  //     });
  //     setRealm(realms);
  //   });

  //   // return () => {
  //   //   if (realm !== null && !realm.isClosed) {
  //   //     realm.close();
  //   //   }
  //   // };
  // }, []);

  // handlePress = () => {
  //   // const start = Date.now();
  //   const start = +new Date();
  //   console.log('start write ', start);

  //   Realm.open({schema: [CarSchema]}).then(async realms => {
  //     for (let i = 0; i < 1000; i++) {
  //       await realms.write(() => {
  //         realms.create('Car', {
  //           make: 'Honda',
  //           model: 'Civic',
  //           miles: 1000,
  //         });
  //       });
  //     }
  //     const millis = +new Date() - start;

  //     console.log(`seconds elapsed = ${millis}`);

  //     setRealm(realms);
  //     setDura(millis);
  //     // realms.close();
  //   });
  // };

  // handleDelete = async () => {
  //   const start = +new Date();
  //   console.log('start write ', start);

  //   // const realms = realm;
  //   Realm.open({schema: [CarSchema]}).then(async realms => {
  //     await realms.write(() => {
  //       let allCar = realms.objects('Car');
  //       realms.delete(allCar); // Deletes all books
  //     });

  //     const millis = +new Date() - start;

  //     console.log(`seconds elapsed = ${millis}`);

  //     setRealm(realms);
  //     setDura(millis);
  //     // realms.close();
  //   });

  // const promise = new Promise(function(resolve, reject) {
  //   const realms = realm;
  //   realms
  //     .write(() => {
  //       let allCar = realms.objects('Car');
  //       realms.delete(allCar);
  //     })
  //     .then(() => resolve(realms));
  // });

  // promise.then(realms => {
  //   const millis = +new Date() - start;

  //   setRealm(realms);

  //   console.log(`seconds elapsed = ${millis}`);
  //   console.log('deleted');
  //   // Deletes all books
  // });

  // realms.write(() => {
  //   let allCar = realms.objects('Car');
  //   realms.delete(allCar);
  // });
  // console.log('deleted');
  // };

  // handleQuery = () => {
  //   // let cars = realm.objects('Car');
  //   // console.log('Query ', cars);
  //   // setCars(cars);

  //   const start = +new Date();
  //   console.log('start write ', start);

  //   Realm.open({schema: [CarSchema]}).then(async realms => {
  //     let cars = await realms.objects('Car');
  //     console.log('Query ', cars);
  //     setCars(cars);
  //     const millis = +new Date() - start;

  //     console.log(`seconds elapsed = ${millis}`);

  //     setRealm(realms);
  //     setDura(millis);
  //     // realms.close();
  //   });
  // };

  // let info = realm
  //   ? 'Number of car in this Realm: ' + realm.objects('Car').length
  //   : 'Number of car in this Realm: 0';

  const handleAdd = async () => {
    await realm.write(() => {
      realm.create('Car', {
        make: make,
        model: model,
        description: description,
        miles: 0,
        persons: userData,
        // persons: 'Person[]',
      });
    });
    let carList = await realm
      .objects('Car')
      .filtered(`persons.userName = "${userData.userName}"`);
    console.log('carList', carList);
    setCarList(carList);
  };

  const handleDelete = async item => {
    await realm.write(() => {
      realm.delete(item);
      console.log('deleted');
    });
    let carList = await realm
      .objects('Car')
      .filtered(`persons.userName = "${userData.userName}"`);
    console.log('carList', carList);
    setCarList(carList);
  };

  // const getCarList = () => {
  //   realm.then(async realms => {
  //     let carList = await realms
  //       .objects('Car')
  //       .filtered(`persons.userName = "${userData.userName}"`);
  //     console.log('carList', carList);
  //     setCarList(carList);
  //   });
  // };

  const handleGoRegister = () => {
    setIsRegister(true);
    setIsLogedIn(false);
  };
  const handleGoLogin = () => {
    realm.then(async realms => {
      await realms.write(() => {
        realms.create('Person', {
          name: name,
          userName: userNameRegis,
          password: passRegister,
        });
      });

      let person = await realms.objects('Person');
      console.log(person);
    });

    setIsLogedIn(true);
    setIsRegister(false);
  };
  const handleGoHome = () => {
    realm.then(async realms => {
      let person = await realms
        .objects('Person')
        .filtered(
          `userName = "${userNameLogin}" AND password = "${passwordLogin}"`,
        );
      console.log('person', person);
      if (person.length > 0) {
        let carList = await realms
          .objects('Car')
          .filtered(`persons.userName = "${person[0].userName}"`);
        console.log('carList', carList);
        setCarList(carList);
        setIsLogedIn(false);
        setIsRegister(false);
        setUserData(person[0]);
      } else {
        alert('Wrong Email Or Password');
      }
    });
  };
  const handleGoHome_ = async () => {
    const adminUser = await Realm.Sync.User.login(
      SERVER_URL,
      Realm.Sync.Credentials.usernamePassword(userNameLogin, passwordLogin),
    );

    const realm_ = await Realm.open({
      schema: [CarSchema, PersonSchema],
      sync: {
        user: adminUser,
        url: `realms://${SERVER_ADDRESS}/aRealm`,
      },
    });

    let person = await realm_
      .objects('Person')
      .filtered(`userName = "${userNameLogin}"`);
    console.log('person', person);
    if (person.length > 0) {
      let carList = await realm_
        .objects('Car')
        .filtered(`persons.userName = "${person[0].userName}"`);
      console.log('carList', carList);
      setRealm(realm_);
      setCarList(carList);
      setIsLogedIn(false);
      setIsRegister(false);
      setUserData(person[0]);
    } else {
      alert('Wrong Email Or Password');
    }
  };

  // console.log('userNameLogin', userNameLogin);
  // console.log('passwordLogin', passwordLogin);
  // console.log('userNameRegis', userNameRegis);
  // console.log('name', name);
  // console.log('passRegister', passRegister);

  if (isLogedIn) {
    return (
      <Login
        onGoRegister={handleGoRegister}
        onGoHome={handleGoHome_}
        username={text => setUsernameLogin(text)}
        password={text => setPasswordLogin(text)}
      />
    );
  } else if (isRegister) {
    return (
      <Register
        onGoLogin={handleGoLogin}
        name={text => setName(text)}
        username={text => setUsernameRegis(text)}
        password={text => setPassRegister(text)}
      />
    );
  } else {
    return (
      <Home
        make={text => setMake(text)}
        model={text => setModel(text)}
        description={text => setDescription(text)}
        data={carList}
        add={handleAdd}
        delete={item => handleDelete(item)}
      />
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    color: 'black',
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
