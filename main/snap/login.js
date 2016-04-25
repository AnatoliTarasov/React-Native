"use strict";
/**
 ==================================================================================
 Description:       desc
 Creation Date:     3/10/16
 Author:            Osipe
 ==================================================================================
 Revision History
 ==================================================================================
 Rev    Date        Author           Task                Description
 ==================================================================================
 1      3/10/16     Osipe          TaskNumber          Created
 ==================================================================================
 */
var React = require('react-native');
var {NativeModules} = require('react-native');
var FBLogin = require('react-native-facebook-login');
var server_auth = require('./server_auth');
var FBLoginManager = NativeModules.FBLoginManager; // if needed

var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
	Image,
	ScrollView,
	TouchableOpacity,
	DrawerLayoutAndroid,
	Picker
	} = React;

var LoginComponent = React.createClass({
   getInitialState: function() {
	   
	   var addid={}
	   
	   //var txt = "{ 'order' : ['address_id':3,'line_items_attributes':[{ product_id: 10, amount: 3 }]]}";
	  // var txt = "{order : [address_id:3,address_id:5]}";
	 // var txt = '{ "order" : { "address_id":3 , "line_items_attributes": [{ "product_id": 5, "amount": 3,"wanted_date":"2016-04-07" }] } }';
	 // var obj = JSON.parse(txt);
	   
    //console.log(obj['order']['address_id'])	   ;
    //console.log(obj['order']['line_items_attributes'])	   ;
    return {
      //username: 'sathish1@greenridge.in',
      username: 'sathish@greenridge.in',
      //password: 'fresh123',
      password: 'web123@@',
	  error:'',
	  error1:'',
	  views:'main',
	  phone:'',
	  flag:'',
	 
    }
  },
  login_check:function(){		
		var context = this;
       // context.props.navigator.push({ name: 'placefold' });
	   
		server_auth.authenticate_username_password("https://rivo.herokuapp.com/", this.state.username, this.state.password).then((res) => {
           //	context.props.setState.user_inf	=res;
			var response = res.headers.map;	
				
			context.props.setaccesstoken(response['access-token'][0]);
			context.props.settokentype(response['token-type'][0]);
			context.props.setexpiry(response['expiry'][0]);
			context.props.setclient(response['client'][0]);
			context.props.setuid(response['uid'][0]);
					
			context.setState({error:""});
            context.props.navigator.push({ name: 'middlehome' });
            
        }).catch((err) => {
            if (err == "Invalid login credentials. Please try again.") {
                context.setState({error:"Invalid login credentials. Please try again."});
            }
            else {
                context.setState({error:err});
            }			
        });		
   		
  },
  
  onforgetpress:function(){	 
	   this.setState({flag:"1"});
	   this.drawer.openDrawer();
	   //console.log(this.drawer);
  },
  
  onRegister:function(){
	   this.setState({flag:"2"});
	   this.drawer.openDrawer()
  },
  
  onsubmitpress: function(){
	  var context = this;
	  console.log("submit");
	  context.password_recovery("https://rivo.herokuapp.com/", this.state.phone).then((res) => {
           //	context.props.setState.user_inf	=res;			
			
			context.setState({error1:"555"});
            context.drawer.closeDrawer(); 
            
        }).catch((err) => {         
             
			context.setState({error1:"no user with such phone registered"});
           		
        });		 
  },
  
password_recovery: function(server_url, phone){
	var context = this;
	return new Promise(function(resolve, reject) {
        var login_route = server_url + 'users/send_sms_with_recovery_password';
        console.log(login_route);     
		console.log(phone);		
	    fetch(login_route, {
             method: "POST",
                headers: {
                    'Accept': 'application/json',
					'Content-Type': 'application/json',
					"cookie" : ""
					
                },				
				 body: JSON.stringify({
					 phone: phone
					
				   })
        }).then((response) => {
			console.log(response);
			
		 if(response.status==200){				
				return resolve();
			}
		 else{			
			response.json().then(function(json_response) {	
			 		
			   return reject();
		    }).catch(function(err) {			 
			   return reject();
            }); 				
			
		  }			
        }).catch(function(err) {
			return reject();
        });
    });
},
  render: function() {
	  var error =<Text>{""}</Text>;

        if (this.state.error) {
            error =  <View style={styles.error_txt}><Text style={{color:'green',fontSize:10}}>{this.state.error}</Text></View>			
        } 
		
         return (
         <DrawerLayoutAndroid drawerWidth={windowSize.width}				  			 
				                    drawerPosition={DrawerLayoutAndroid.positions.Right}
				                    ref={(drawer) => { this.drawer = drawer; }}				
				                    renderNavigationView={this.navigation}>
									
		  <View style={styles.container}>
           
		   <Image style={styles.bg} source={require('../images/Back_bg.jpg')} />
		
            <View style={styles.header}>
          
            </View>
			{error}
            <View style={styles.inputs}>
                <View style={styles.inputContainer}>
                    <Image style={styles.inputUsername} source={require('../images/iVVVMRX.png')}/>
                    <TextInput 
                        style={[styles.input, styles.blackFont]}
                        placeholder="Enter your mobile number"
                        placeholderTextColor="#bbb"
                        onChangeText={(text) => this.setState({username:text})}
						value={this.state.username}
                    />
                </View>	
				
                <View style={styles.inputContainer}>                   
					<Image style={styles.inputPassword} source={require('../images/ON58SIG.png')}/>
                    <TextInput
                        password={true}
                        style={[styles.input, styles.blackFont]}
                        placeholder="Password"
                        placeholderTextColor="#d6d4d4"
					     value={this.state.password}
                        onChangeText={(text) => this.setState({password:text})}
                    />
                </View>
				
                <View style={styles.forgotContainer}>
                    <TouchableOpacity onPress={this.onforgetpress} >
					<Text style={styles.yellowFont}>Forgot your password ?</Text>
					</TouchableOpacity>
                </View>
				
				<View style={styles.signin}>   
				  <TouchableOpacity style={{paddingLeft:50,paddingRight:50}} onPress={this.login_check}>				
					<Text style={styles.whiteFont}>Sign In</Text>	
				  </TouchableOpacity>					
			    </View>
				
				 <View style={styles.FBfont}>                 
					<FBLogin style={styles.FBLogin}/>				   
			    </View>
		      </View>
			  
			  <View style={styles.signup}>
					<View><Text style={styles.greyFont}>Don't have an account? </Text></View>
					<View >
						<TouchableOpacity onPress={this.onRegister}>
							<Text style={styles.yellowFont}>       Register</Text>
						</TouchableOpacity>
					</View>
			  </View>
			  
          </View>
		  
		  </DrawerLayoutAndroid>
         );
		
  },
  
  navigation(){ // if you forget the password?
	 var error_forget =<Text>{""}</Text>;
	 var context=this;
	 if (this.state.error1) {
            error_forget =  <View style={styles.error_txt}><Text style={{color:'green',fontSize:10}}>{context.state.error1}</Text></View>			
        }
	 
     if(this.state.flag == "1"){	//If press 'Forgot your...'
		return(	
			<View style={styles.container}>
				   <Image style={styles.bg} source={require('../images/Back_bg.jpg')} />
				   
				   <View style={styles.header}>          
				   </View>
				   
				   {error_forget}
				   <View style={styles.inputs}>
						<View style={styles.inputContainer}>
							<Image style={styles.inputUsername} source={require('../images/iVVVMRX.png')}/>
							<TextInput 
								style={[styles.input, styles.blackFont]}
								placeholder="Enter your mobile number"
								placeholderTextColor="#d6d4d4"
								onChangeText={(text) => this.setState({phone:text})}
								
							/>
						</View>	
					
						<View style={styles.submit_btn}>   
						  <TouchableOpacity style={{paddingLeft:60,paddingRight:60}} onPress={this.onsubmitpress}>				
							<Text style={styles.whiteFont}>Submit</Text>	
						  </TouchableOpacity>					
						</View>
					
				   </View>
			</View>
		  );
	 
	 }else{		//If press 'Register'
		 
		 return(	
			<View style={styles.container}>
				   <Image style={styles.bg} source={require('../images/Back_bg.jpg')} />
				   
				   <View style={{flex:0.20}}></View>
				   
				   <View style={styles.inputs}>
						<View style={styles.inputContainer}>
							<Image style={styles.inputUsername} source={require('../images/iVVVMRX.png')}/>
							<TextInput 
								style={[styles.input, styles.blackFont]}
								placeholder="Name"	placeholderTextColor="#d6d4d4"
								onChangeText={(text) => this.setState({phone:text})}
							/>
						</View>	
						
						<View style={styles.inputContainer}>
							<Image style={styles.inputUsername} source={require('../images/iVVVMRX.png')}/>
							<TextInput 
								style={[styles.input, styles.blackFont]}
								placeholder="Email"	placeholderTextColor="#d6d4d4"
								onChangeText={(text) => this.setState({phone:text})}
							/>
						</View>
						
						<View style={styles.inputContainer}>
							<Image style={styles.inputPassword} source={require('../images/ON58SIG.png')}/>
							<TextInput 
								password={true}
								style={[styles.input, styles.blackFont]}
								placeholder="Password"	placeholderTextColor="#d6d4d4"
								
							/>
						</View>
						
						<View style={styles.inputContainer}>
							<Image style={styles.inputPassword} source={require('../images/ON58SIG.png')}/>
							<TextInput 
								password={true}
								style={[styles.input, styles.blackFont]}
								placeholder="Confirm Password"	placeholderTextColor="#d6d4d4"
								
							/>
						</View>
					
						<View style={styles.submit_btn}>   
							  <TouchableOpacity style={{paddingLeft:60,paddingRight:60}} onPress={this.onsubmitpress}>				
									<Text style={styles.whiteFont}>Register</Text>	
							  </TouchableOpacity>					
						</View>
					
				   </View>
			</View>
		  );
	 }
  }
});

var styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      flex: 1,
      backgroundColor: 'transparent'
    },
    bg: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: windowSize.width,
        height: windowSize.height,
	},
	
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: .42,
         backgroundColor: 'transparent',
       
    },
	error_txt:{	
		justifyContent: 'center',
		alignItems: 'center',
	},
    mark: {
        width: 150,
        height: 150
    },
    signin: {
        backgroundColor: '#f46527',
        padding: 12,        
		top:8,  
        alignItems: 'center',
		borderRadius :5,
	},
	signinbox:{
		backgroundColor: 'red',
		marginLeft:10,
		marginRight:10,
	},
    signup: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: .10,
	  flexDirection: 'row',
      
		
    },
    inputs: {
        marginTop: 10,
        marginBottom: 10,
        flex: .47,
		padding:5,
		paddingLeft:40,
		paddingRight:40,
		paddingBottom:5,	
		
			
    },
    inputPassword: {
        marginLeft: 1,
        width: 20,
        height: 21
    },
    inputUsername: {
      marginLeft: 1,
      width: 20,
      height: 20
    },
    inputContainer: {
        padding: 10,
        borderWidth: 1,
        borderBottomColor: '#CCC',
        borderColor: 'transparent',      
	    height:50,
		
    },
    input: {
        position: 'absolute',
        left: 41,
        top: 10,
        right: 0,
        height: 47,
        fontSize: 16,
		paddingBottom:22,
		borderWidth: 10,
    },
    forgotContainer: {
      alignItems: 'flex-end',
      padding: 10,
	  paddingRight:0,
	
    },
    greyFont: {
      color: '#fff'
    },
    whiteFont: {
      color: '#FFF'
    },
	blackFont:{
		color:'#eee'
	},
	yellowFont:{
	  
		color:'#ffbd54'
	},
	signFont:{
		color: '#FFF',		
	},
	FBfont:{
		top:15,
		paddingTop:10,		
	},
	FBLogin:{
		borderRadius :5,
	},
	  submit_btn: {
        backgroundColor: '#f46527',
        padding: 12,        
		top:25,  
        alignItems: 'center',
		borderRadius :5,
	},
	
})

AppRegistry.registerComponent('LoginComponent', () => LoginComponent);
module.exports = LoginComponent;