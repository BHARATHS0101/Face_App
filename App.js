import React, { useState, useEffect, Component } from 'react';
import {Image, Platform, StyleSheet, Text , View, TouchableOpacity, ScrollView, ActivityIndicator, } from 'react-native';
import {Slider} from 'react-native-elements'
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
      ageButton: 0,
      toLoadPage: false,
      isuploaded: false,
      value: 5,
      error: false,
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
    this.setState({ageButton: age})
    await axios.get('http://192.168.0.125:3000/get_image/'+age,)
    .then((response) => {
      this.setState({faceAgeImage: response.data, AgeFlag: true})
      console.log(this.state.faceAgeImage.length)
      console.log("image recieved!!!")
    })
    .catch((error) => {
      console.log(error);
      this.setState({error: true})
    });    
  }

  changeComponents2 = () => {
    console.log("change component2 called")
    this.setState({image_response_data: null, isuploaded: false, toLoadPage: false, image_uri: null, error: false})
  }

  uploadImage = async() => {
    
    const formData = new FormData()
    formData.append("img", {uri: this.state.image_uri, name: 'newimage.jpg', type:'image/jpg'})

    console.log(formData)

    setTimeout(() => {
      if(this.state.image_response_data){
        this.setState({toLoadPage: false})
      }else {
        this.setState({error: true})
      }
    }, 10000);

    this.setState({image_response_data: null, isuploaded: true, toLoadPage: true,})

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
      this.setState({error: true})
    });  
}

  render(){

    if (this.state.image_response_data) {
      return (
        <View style={styles.container}>

        {/* this view is for navigation bar */}
  
        <View style= {styles.container2}>
          <Text style={styles.container2Head}>FACE_AGE</Text>
        </View>
  
        
        <ScrollView>

          {/* this view is for output section */}

          <View style={styles.container}>

            {/* this view is for Age Group section */}

            <View style={styles.container5}>
              <View style={{flex: 1}}>
              <Text style={styles.container5button}>Age Group</Text>
              </View>  
            </View>

            
            {/* this view is for image selecting age to get image at that particular age time-period */}

            <View style={styles.container3}>
              { this.state.image_response_data?
              <TouchableOpacity style={[styles.button3, {backgroundColor: this.state.ageButton == 0 ? 'rgba(50, 100, 102, 1)':'rgba(0,0,0,0.1)'}]} onPress={() => {this.getFaceAge(0)}}>
                <Text style={[styles.buttonText1, {color: 'rgba(0,0,0,1)', fontWeight: 'bold'}]}>10-20</Text>
              </TouchableOpacity>:null}
              { this.state.image_response_data?  
              <TouchableOpacity style={[styles.button3, {backgroundColor: this.state.ageButton == 1 ? 'rgba(50, 100, 102, 1)':'rgba(0,0,0,0.1)'}]} onPress={() => {this.getFaceAge(1)}}>
                <Text style={[styles.buttonText1, {color: 'rgba(0,0,0,1)', fontWeight: 'bold'}]}>20-30</Text>
              </TouchableOpacity>:null}
              { this.state.image_response_data?
              <TouchableOpacity style={[styles.button3, {backgroundColor: this.state.ageButton == 2 ? 'rgba(50, 100, 102, 1)':'rgba(0,0,0,0.1)'}]} onPress={() => {this.getFaceAge(2)}}>
                <Text style={[styles.buttonText1, {color: 'rgba(0,0,0,1)', fontWeight: 'bold'}]}>30-40</Text>
              </TouchableOpacity>:null}
            </View>        

            <View style={styles.container3}>
              { this.state.image_response_data?
              <TouchableOpacity style={[styles.button3, {backgroundColor: this.state.ageButton == 3 ? 'rgba(50, 100, 102, 1)':'rgba(0,0,0,0.1)'}]} onPress={() => {this.getFaceAge(3)}}>
                <Text style={[styles.buttonText1, {color: 'rgba(0,0,0,1)', fontWeight: 'bold'}]}>40-50</Text>
              </TouchableOpacity>:null}
              { this.state.image_response_data?  
              <TouchableOpacity style={[styles.button3, {backgroundColor: this.state.ageButton == 4 ? 'rgba(50, 100, 102, 1)':'rgba(0,0,0,0.1)'}]} onPress={() => {this.getFaceAge(4)}}>
                <Text style={[styles.buttonText1, {color: 'rgba(0,0,0,1)', fontWeight: 'bold'}]}>50+</Text>
              </TouchableOpacity>:null}
            </View>

            
            {/* this views is for lines */}
            
            { this.state.image_response_data?
            <View style={styles.line}></View>:null}
            { this.state.image_response_data?
            <View style={styles.line2}></View>:null}


            {/* this view is for Displaying Output Image section */}
            
            <View style={styles.container5}>
              <View style={{flex: 1}}>
              <Text style={styles.container5button}>Output Image</Text>
              </View>  
            </View>

            
            {/* this view is for displaying image */}

            { this.state.image_response_data?
            <View style={styles.container6}>
              {this.state.image_response_data ? <Image source={{uri: 'data:image/png;base64,'+this.state.faceAgeImage}} style={{ width: 350, height: 250 }}/>:null}
            </View> :null}

            
            {/* this view is for Displaying Output Image section */}
            
            <View style={styles.container5}>
              <View style={{flex: 1}}>
              <Text style={styles.container5button}>Rating  -  {this.state.value}/10</Text>
              </View>
            </View>


            {/* this view is for rating slider */}

            <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center', width: 370, margin: 10 }}>
              <Slider
                value= {5}
                onValueChange={(value) => this.setState({ value: value })}
                maximumValue={10}
                minimumValue={1}
                step={1}
                trackStyle={{ height: 7, }}
                thumbStyle={{ justifyContent: 'center', alignItems: 'center', height: 50, width: 50, backgroundColor: 'rgba(255,255,255,1)'}}
                thumbProps={{
                  children: (
                    <Icon name="smile" size={51} style={{color: 'rgba(0, 120, 0, 1)'}}/>
                  ),
                }}
                maximumTrackTintColor={'rgba(220, 0, 0, 0.8)'}
                minimumTrackTintColor={'rgba(15, 157, 88, 0.8)'}
              />
            </View>

            
            {/* this view is for rating submit button */}

            <View style={[styles.container4, {marginBottom: 15, marginTop: 12}]}> 
              <TouchableOpacity style={[styles.button2, {backgroundColor: 'rgba(0, 0, 0, 0.8)'}]} onPress={this.changeComponents2}>
                <Text style={[styles.buttonText2, {color: 'rgba(255,255,255,1)'}]}>Submit</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>

      </View>
      )

    }else if(this.state.isuploaded && !this.state.image_response_data && !this.state.error && this.state.toLoadPage){

      return (
        <View style={styles.container}>
          
          {/* this view is for navigation bar */}
    
          <View style= {styles.container2}>
            <Text style={styles.container2Head}>FACE_AGE</Text>
          </View>          

          
          {/* this view is for loading indicator */}

          <View style={styles.loadingContainer}>
            <ActivityIndicator size={65} color= 'rgba(50, 100, 102, 1)' />
            <Text style= {{fontFamily: 'monospace', fontSize: 15, marginLeft: 20, marginTop: 15, fontWeight: 'bold'}}>Loading...</Text>
          </View>
          
        </View>        
      )

    }else if(this.state.error){

      return (
        <View style={styles.container}>
          
          {/* this view is for navigation bar */}
    
          <View style= {styles.container2}>
            <Text style={styles.container2Head}>FACE_AGE</Text>
          </View>          

          
          {/* this view is for error displaying */}

          <View style={styles.loadingContainer}>
            <Icon name='exclamation-triangle' size={40} style={{color: 'rgba(255,0,0,1)'}}></Icon>
            <Text style= {{fontFamily: 'monospace', fontSize: 17, marginLeft: 30, marginTop: 15, fontWeight: 'bold'}}>Connection Error...</Text>
            <TouchableOpacity style={[styles.button2, {backgroundColor: 'rgba(66, 133, 244, 1)', marginTop: 70, width: 100, height: 45}]} onPress={this.changeComponents2}>
              <Text style={[styles.buttonText2, {color: 'rgba(255,255,255,1)', fontWeight: 'normal'}]}>Retry</Text>
            </TouchableOpacity>
          </View>

        </View>    
      )

    }else {

      return (
        <View style={styles.container}>
  
          {/* this view is for navigation bar */}
    
          <View style= {styles.container2}>
            <Text style={styles.container2Head}>FACE_AGE</Text>
          </View>
    
          <ScrollView>
  
          <View style={styles.container}>
              
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


                            
              {/* this view is for upload button */}
  
              <View style={styles.container4}>
                {this.state.image_uri ? 
                  <TouchableOpacity style={styles.button2} onPress={this.uploadImage}>
                    <Text style={[styles.buttonText2, {color: 'rgba(255,255,255,0.8)'}]}>Upload</Text>
                  </TouchableOpacity>:
                  <TouchableOpacity disabled={true} style={[styles.button2, {backgroundColor: 'rgba(0,0,0,0.8)'}]} onPress={this.uploadImage}>
                    <Text style={[styles.buttonText2, {color: 'rgba(255,255,255,0.4)'}]}>Upload</Text>
                  </TouchableOpacity>
                }          
              </View>
          
          </View> 
        </ScrollView>
  
       </View>
      )
    } 
  };
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 40,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  
  container3: {
    width: 400,
    marginTop: 30,
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
    marginTop: 30,
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
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },   

  buttonText1:{
    fontSize: 20,
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
    color: 'rgba(255,255,255,0.5)'
  },

  buttonText21:{
    fontSize: 20,
    fontWeight: "bold",
    color: 'rgba(255,255,255,1)'
  },

  line: {
    marginTop: 30,
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