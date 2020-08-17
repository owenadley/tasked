
import React from 'react';
import {

  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView

} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {CheckBox} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from './Header';

class List extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            completedListItems: [],
            incompleteListItems: [],
            newListItem: false,
            newListItemName: '',
            user: {}
        }
    }

    componentDidMount() {
        this.getListItems();
        this.getUser();


    }

    getUser = async () => {
      try {
        const value = await AsyncStorage.getItem('userToken');
        if (value !== null) {
          // We have data!! 
          let jsonUser = JSON.parse(value);
          console.log(jsonUser.data)
          this.setState({user: jsonUser.data})
        }
      } catch (error) {
        // Error retrieving data
      }
    };
    
    getListItems = () => {
        console.log('userid: ' + this.state.user.idusers)
        fetch(`http://localhost:5000/getListItems/?idusers='1'&idlists=${this.props.route.params.list.idlists}`)
        .then((response) => response.json())
        .then((responseJson) => {
            
            let completedListItems = [];
            let incompleteListItems = [];

            responseJson.listitems.forEach((listitem) => {
                listitem.completed ? completedListItems.push(listitem) : incompleteListItems.push(listitem)
            })

            this.setState({
                completedListItems: completedListItems,
                incompleteListItems: incompleteListItems
            });
        })
        .catch((error) => {
            console.log(error); 
        })
    }

    setListItemName = (text) => {
        this.setState({newListItemName: text})
    }

    submitNewListItem = () => {
        fetch(`http://localhost:5000/createNewListItem/?title=${this.state.newListItemName}&idusers=${this.state.idusers}&idlists=${this.props.route.params.list.idlists}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(
            this.getListItems(),
            this.setState({newListItem: false})
        )
        .catch((error) => {
          console.log(error);
        })
    }

    createNewListItem = () => {
        this.setState({newListItem: true})
    }


    toggleCheckbox = (id, isComplete) => {

        console.log(isComplete)

        // toggle the completed property
        // remove from current array
        // unshift into other array

        if (Boolean(isComplete)) {

                this.state.completedListItems.map (
                    (listitem, index) => {
                        if (listitem.idlistitems === id) {
                            listitem.completed = !isComplete;       // toggle isComplete for the listitem

                            let currIncomplete = this.state.incompleteListItems;   // get current state
                            let updatedIncomplete = [listitem, ...currIncomplete];  // add toggled task to incomplete
                            this.setState({incompleteListItems: updatedIncomplete});    // update state

                            let updatedComplete = this.state.completedListItems;  // remove the listitem from the complete arr
                            updatedComplete.splice(index, 1)
                            this.setState({completedListItems: updatedComplete})
                        }
                    }
                )
            
        } else {
            this.state.incompleteListItems.map (
                (listitem, index) => {
                    if (listitem.idlistitems === id) {
                        listitem.completed = !isComplete;       // toggle isComplete for the listitem

                        let currComplete = this.state.completedListItems;   // get current state
                        let updatedComplete = [listitem, ...currComplete];  // add toggled task to incomplete
                        this.setState({completedListItems: updatedComplete});    // update state

                        let updatedIncomplete = this.state.incompleteListItems;  // remove the listitem from the complete arr
                        updatedIncomplete.splice(index, 1)
                        this.setState({incompleteListItems: updatedIncomplete})
                    }
                }
            )
        }


        // update the list item to complete or incomplete
        fetch(`http://localhost:5000/toggleListItem/?idlistitems=${id}&value=${!isComplete}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .catch((error) => {
          console.log(error);
        })

    }

    render() {

        return (

            <View style={{flex: 1, backgroundColor:'#ecf0f1'}}>
              <View style={{
                padding: 20,
              }}>

                <Header navigation={this.props.navigation} iname="chevron-left" nHandler={this.props.navigation.goBack} pHandler={this.createNewListItem}/>

                <View style={{
                    display: "flex", 
                    flexDirection: "row",
                    justifyContent: "space-between"
                    }}>
        
                    <View style={{display: "flex", flexDirection: "column"}}>
                        <Text style={{fontSize: 30}}>{this.props.route.params.list.name}</Text>
                    </View>
                    
                </View>
    
              </View>

                <View>

                    {this.state.newListItem ?
                        <View style={{flexDirection:'row', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 17, borderRadius: 10, height: 90, margin: 20}}>
                            <View style={{flex:3, height: 90, padding: 20}}>                        
                                <TextInput style={{}}
                                placeholder='Task name ... '
                                onChangeText={text => this.setListItemName(text)}/>          
                            </View>
                            <View style={{flex:1, justifyContent: 'center', alignItems: 'center', height: 90, backgroundColor:'#44bd32', borderTopRightRadius: 10, borderBottomRightRadius: 10, elevation: 17}}> 
                                <TouchableOpacity onPress={this.submitNewListItem}><Text style={{color: '#fff'}}>Create</Text></TouchableOpacity>
                            </View>
                        </View>
                    : null}

                </View>

                <ScrollView style={{display: 'flex', margin: 10, alignContent: 'center', flexDirection:'column'}}>
                {this.state.incompleteListItems.map((items) => {
                    return (
                            <View key={items.idlistitems} style={{display:'flex', flexDirection:'row'}}>
                                <CheckBox 
                                    containerStyle={{backgroundColor: '#ecf0f1'}}
                                    center 
                                    title={items.title} 
                                    checked={Boolean(items.completed)}
                                    onPress={() => this.toggleCheckbox(items.idlistitems, items.completed)}
                                />
                            </View>
                
                        )
                    })
                }

                {this.state.completedListItems.map((items) => {
                    return (
                            <View key={items.idlistitems} style={{display:'flex', flexDirection:'row'}}>
                                <CheckBox 
                                    containerStyle={{backgroundColor: '#ecf0f1'}}
                                    center 
                                    title={items.title} 
                                    checkedColor='#44bd32'
                                    textStyle={{textDecorationLine:'line-through', color:'grey'}}
                                    checked={Boolean(items.completed)}
                                    onPress={() => this.toggleCheckbox(items.idlistitems, items.completed)}
                                />
                            </View>
                
                        )
                    })
                }

                </ScrollView>

            </View>              
        )

    }


}



export default List;