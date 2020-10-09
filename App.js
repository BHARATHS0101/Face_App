import React, { useState, useEffect, Component } from 'react';
import { Button, Image, Platform, StyleSheet, RefreshControl, Text,Linking , View, TextInput, TouchableOpacity, ScrollView, AsyncStorage, SafeAreaView, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';

export default class ImagePickerExample extends Component {

  constructor(props){
    super(props)
    this.state = {
      image_uri: null,
      image_response_data: null,
      AgeFlag: false,
      faceAgeImage: null,
    }
  }

  get_acess = async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
  }

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({image_uri: result.uri})
      this.setState({image_response_data:null})
    }
  };

  capture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({image: result, image_uri: result.uri})
      this.setState({image_response_data:null})
    }
  };

  async componentDidMount(){
    this.get_acess();
  }

  getFaceAge = async(age) => {
    console.log(age)
    await axios.get('http://192.168.0.125:3000/get_image/'+age,)
    .then((response) => {
      this.setState({faceAgeImage: response.data, AgeFlag: true})
      console.log(this.state.faceAgeImage.length)
      console.log("image recieved!!!")
    })
    .catch((error) => {
      console.log(error);
    });    
  }

  uploadImage = async() => {
    
    const formData = new FormData()
    formData.append("img", {uri: this.state.image_uri, name: 'newimage.jpg', type:'image/jpg'})
    console.log(formData)

    await axios
    .post('http://192.168.0.125:3000/upload_file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      this.setState({image_response_data: response.data})
      console.log(this.state.image_response_data.length)
      console.log("image uploaded!!!")
    })
    .catch((error) => {
      console.log(error);
    });  
}

  render(){
    return (
      <ScrollView>
        <View style={styles.container}>
        
            {/* this view is for navigation bar */}

            <View style={styles.container2}>
              <Text style={styles.container2Head}>FACE_APP</Text>
            </View>

            
            {/* this view is for image picking buttons */}

            <View style={styles.container3}>
              <TouchableOpacity style={styles.button1} onPress={this.pickImage}>
                <Icon name="image" size={28} style={styles.inputIcon}/>
                <Text style={styles.buttonText1}>select</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button1} onPress={this.capture}>
                <Icon name="camera" size={27} style={styles.inputIcon}/>
                <Text style={styles.buttonText1}>camera</Text>
              </TouchableOpacity>
            </View>

            
            {/* this view is for upload button */}

            <View style={styles.container4}>
              {this.state.image_uri ? 
                <TouchableOpacity style={styles.button2} onPress={this.uploadImage}>
                  <Text style={styles.buttonText2}>Upload</Text>
                </TouchableOpacity>:
                <TouchableOpacity disabled={true} style={styles.button2} onPress={this.uploadImage}>
                  <Text style={styles.buttonText2}>Upload</Text>
                </TouchableOpacity>
              }          
            </View>

            
            {/* this views is for lines */}

            <View style={styles.line}></View>
            <View style={styles.line2}></View>

            
            {/* this view is for input image */}

            <View style={styles.container5}>
              <View style={{flex: 1}}>
                <Text style={styles.container5button}>Input Image</Text>
              </View>  
            </View>

            
              {/* this view is for displaying image */}
            
            <View style={styles.container6}>
              {/* {this.state.image_response_data ? <Image source={{ uri: 'data:image/png;base64,'+this.state.image_response_data}} style={{ width: 350, height: 250 }} />:null} */}
              {this.state.image_uri ? <Image source={{ uri: this.state.image_uri}} style={{ width: 350, height: 250 }} />:null}
            </View> 

            
            {/* this views is for lines */}

            <View style={styles.line}></View>
            <View style={styles.line2}></View>

            
            {/* this view is for output section */}

            <View style={styles.container5}>
              <View style={{flex: 1}}>
                { this.state.image_response_data?
                  <Text style={styles.container5button}>Output Image</Text>:null
                }
              </View>  
            </View>

            
            {/* this view is for image selecting age to get image at that particular age time-period */}

            <View style={styles.container3}>
              { this.state.image_response_data?
              <TouchableOpacity style={styles.button3} onPress={() => {this.getFaceAge(0)}}>
                <Text style={styles.buttonText12}>10-20</Text>
              </TouchableOpacity>:null}
              { this.state.image_response_data?  
              <TouchableOpacity style={styles.button3} onPress={() => {this.getFaceAge(1)}}>
                <Text style={styles.buttonText12}>20-30</Text>
              </TouchableOpacity>:null}
              { this.state.image_response_data?
              <TouchableOpacity style={styles.button3} onPress={() => {this.getFaceAge(2)}}>
                <Text style={styles.buttonText12}>30-40</Text>
              </TouchableOpacity>:null}
            </View>        

            <View style={styles.container3}>
              { this.state.image_response_data?
              <TouchableOpacity style={styles.button3} onPress={() => {this.getFaceAge(3)}}>
                <Text style={styles.buttonText12}>40-50</Text>
              </TouchableOpacity>:null}
              { this.state.image_response_data?  
              <TouchableOpacity style={styles.button3} onPress={() => {this.getFaceAge(4)}}>
                <Text style={styles.buttonText12}>50+</Text>
              </TouchableOpacity>:null}
            </View>

            
            {/* this view is for displaying image */}
            { this.state.image_response_data?
            <View style={styles.container6}>
              {this.state.image_response_data ? <Image source={{uri: 'data:image/png;base64,'+this.state.faceAgeImage}} style={{ width: 350, height: 250 }}/>:null}
            </View> :null}

            
            {/* this views is for lines */}
            
            { this.state.image_response_data?
            <View style={styles.line}></View>:null}
            { this.state.image_response_data?
            <View style={styles.line2}></View>:null}
        
        </View> 
      </ScrollView>

  )};
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },

  container2: {
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(50, 100, 102, 1)',
    height: 100,
    width: 500,
    borderRadius: 10,
    flexDirection:'row'
  },

  container2Head: {
    color: 'rgba(255,255,255,1)',
    fontSize: 25,
    marginBottom: 15,
    marginTop: 40,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  
  container3: {
    width: 400,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  }, 

  inputbox:{
    height: 50,  
    width: 340, 
    fontSize: 25,
    paddingLeft: 13,
    color: 'grey',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,1)',
    borderBottomColor: '#f07400',  
  },

  inputIcon:{
    color: 'rgba(50, 100, 102, 1)'
  },

  container4:{
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },

  button1:{
    height: 50,  
    width: 110,
    borderRadius: 6, 
    backgroundColor:'rgba(0,0,0,0.1)',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }, 
  
  button3:{
    height: 50,  
    width: 90,
    borderRadius: 6, 
    backgroundColor:'rgba(0,0,0,0.1)',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },   

  buttonText1:{
    fontSize: 20,
    color: 'rgba(0,0,0,1)',
  },

  buttonText12:{
    fontSize: 20,
    color: 'rgba(50, 100, 102, 1)',
    fontWeight: 'bold'
  },

  button2:{
    height: 50,  
    width: 300,
    borderRadius: 10, 
    backgroundColor: 'rgba(0,0,0,0.9)',
    alignItems: 'center',
    justifyContent:'center'
  },
  
  buttonText2:{
    fontSize: 20,
    fontWeight: "bold",
    color: 'rgba(255,255,255,1)'
  },

  line: {
    marginTop: 25,
    height: 4,
    width: 400,
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },

  line2: {
    height: 4,
    width: 400,
    backgroundColor: 'rgba(50, 100, 102, 1)'
  },

  container5: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row'
  },

  container5button:{
    marginLeft: 15,
    fontWeight: 'bold',
    fontSize: 18,
    alignSelf: 'flex-start'
  },

  container6: {
    marginTop: 10,
    flexDirection: 'row',
    height: 270,
    width: 370,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 5,
    justifyContent: 'space-around'
  },

});