import React from 'react';
import Home from '../screens/home/Home';
import { Fonts } from '../../assets/fonts/Fonts';
import UserRoutes from '../user_routes/UserRoutes';
import { COLOURS } from '../../assets/theme/Theme';
import Archives from '../screens/archives/Archives';
import My_Path from '../../user/screens/mypath/My_Path';
import User_Profile from '../screens/profile/User_Profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { globalImages } from '../../assets/images/images_file/All_Images';
import { StyleSheet, Text, View, Image, Dimensions, Easing } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

const { height, width } = Dimensions.get('window')

const Bottom_Navigation = () => {

  const Tab = createBottomTabNavigator();


  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          // animation: 'fade',
          // animationDuration: 400,
          tabBarStyle: {
            position: 'absolute',
            // left: 16,
            // right: 16,
            // bottom: 27,
            // elevation: 0,
            // borderRadius: 15,
            // marginHorizontal: 10,
            alignItems: 'center',
            justifyContent: 'center',
            keyboardHidesTabBar: true,
            height: responsiveWidth(18),
            backgroundColor: COLOURS.white,
          }
        }}>

        <Tab.Screen name={UserRoutes.Home} component={Home} options={{
          tabBarIcon: ({ focused }) => (
            < View style={{
              alignItems: 'center', paddingTop: responsiveWidth(3),
              width: width / 5, top: responsiveWidth(2),
            }}>
              <Image source={focused ? globalImages.home_filled : globalImages.home_icon} style={{
                height: responsiveWidth(5.5), width: responsiveWidth(5.5),
              }} tintColor={focused ? COLOURS.primary : COLOURS.grey} />
              <Text style={{ color: focused ? COLOURS.primary : COLOURS.grey, fontFamily: focused ? Fonts.Medium : Fonts.Regular, fontSize: responsiveFontSize(1.7) }}>Home</Text>
            </View>
          ),
        }} />
        <Tab.Screen name={UserRoutes.Archives} component={Archives} options={{
          tabBarIcon: ({ focused }) => (
            < View style={{
              alignItems: 'center', paddingTop: responsiveWidth(3),
              width: width / 5, top: responsiveWidth(2),
            }}>
              <Image source={focused ? globalImages.archive_icon : globalImages.archive_light} style={{
                height: responsiveWidth(5.5), width: responsiveWidth(5.5),
              }} tintColor={focused ? COLOURS.primary : COLOURS.grey} />
              <Text style={{ color: focused ? COLOURS.primary : COLOURS.grey, fontFamily: focused ? Fonts.Medium : Fonts.Regular, fontSize: responsiveFontSize(1.7) }}>Archives</Text>
            </View>
          ),
        }} />

        <Tab.Screen name={UserRoutes.My_Path} component={My_Path} options={{
          tabBarIcon: ({ focused }) => (
            < View style={{
              alignItems: 'center', paddingTop: responsiveWidth(3),
              width: width / 5, top: responsiveWidth(2),
            }}>
              <Image source={focused ? globalImages.access_icon : globalImages.access_light} style={{
                height: responsiveWidth(5.5), width: responsiveWidth(5.5),
              }} tintColor={focused ? COLOURS.primary : COLOURS.grey} />
              <Text style={{ color: focused ? COLOURS.primary : COLOURS.grey, fontFamily: focused ? Fonts.Medium : Fonts.Regular, fontSize: responsiveFontSize(1.7) }}>My Path</Text>
            </View>
          ),
        }} />

        <Tab.Screen name={UserRoutes.User_Profile} component={User_Profile} options={{
          tabBarIcon: ({ focused }) => (
            < View style={{
              alignItems: 'center', paddingTop: responsiveWidth(3),
              width: width / 5, top: responsiveWidth(2),
            }}>
              <Image source={focused ? globalImages.user_filled : globalImages.user_light} style={{
                height: responsiveWidth(5.5), width: responsiveWidth(5.5),
              }} tintColor={focused ? COLOURS.primary : COLOURS.grey} />
              <Text style={{ color: focused ? COLOURS.primary : COLOURS.grey, fontFamily: focused ? Fonts.Medium : Fonts.Regular, fontSize: responsiveFontSize(1.7) }}>Profile</Text>
            </View>
          ),
        }} />

      </Tab.Navigator >
    </>
  )
}

export default Bottom_Navigation

const styles = StyleSheet.create({})