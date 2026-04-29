import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import Profile from '../../../components/Profile';
import { COLOURS } from '../../../assets/theme/Theme';
import { DOBPicker } from '../../../components/DOBPicker';
import Input_Field from '../../../components/Input_Field';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GenderPicker } from '../../../components/GenderPicker';
import { StatusBar, StyleSheet, View, Text, } from 'react-native';
import { globalImages } from '../../../assets/images/images_file/All_Images';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

import Button from '../../../components/Button';
import { Pulse } from '../../../components/Pulse';
import { FadeIn } from '../../../components/FadeIn';
import { Fonts } from '../../../assets/fonts/Fonts';
import { FadeUp } from '../../../components/FadeUp';
import Title_Here from '../../../components/Title_Here';
import { FadeDown } from '../../../components/FadeDown';
import Trial_Text from '../../../components/Trial_Text';
import { useUser } from '../auth/user_context/UserContext';

const Edit_Profile = () => {

    const { userData } = useUser();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState(null);
    const [gender, setGender] = useState('Male');

    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        if (dateStr instanceof Date) return dateStr;
        const date = new Date(dateStr);
        return isNaN(date) ? null : date;
    };

    const capitalizeFirst = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };


    useEffect(() => {
        if (userData) {
            setName(userData.name || '');
            setEmail(userData.email || '');
            setPhone(userData.phone || '');
            setGender(capitalizeFirst(userData?.gender) || 'Male');
            setDob(parseDate(userData?.dateOfBirth || userData?.dob));
        }
    }, [userData]);

    return (
        <>
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={COLOURS.light_primary}
            />
            <SafeAreaView style={{ flex: 1, backgroundColor: COLOURS.light_primary}}>

                <View style={[styles.container, { backgroundColor: COLOURS.white }]}>

                    <Header title={'edit profile'} />

                    <FadeDown>
                        <Profile alignSelf={'center'} marginTop={responsiveWidth(12)} edit={true} />
                    </FadeDown>

                    <FadeUp>

                        <Title_Here title={userData?.name}
                            color={COLOURS.black}
                            textAlign={'center'}
                            marginTop={responsiveWidth(2)}
                            marginBottom={responsiveWidth(2)}
                            fontSize={responsiveFontSize(2)}
                        />
                        <Title_Here title={userData?.phone}
                            color={COLOURS.light_black}
                            textAlign={'center'}
                            marginTop={responsiveWidth(-2)}
                            marginBottom={responsiveWidth(3)}
                            fontSize={responsiveFontSize(1.8)}
                        />

                        <Pulse>
                            <Trial_Text backgroundColor={COLOURS.light_primary} alignSelf={'center'} />
                        </Pulse>

                    </FadeUp>
                    <FadeIn delay={150}>

                        <Input_Field backgroundColor={COLOURS.transparent} borderColor={COLOURS.light_grey}
                            borderWidth={responsiveWidth(.3)}
                            Input_marginTop={responsiveWidth(6)}
                            color={COLOURS.black}
                            maxLength={20}
                            Placeholder={'Your name'}
                            first_inpt_Img={globalImages.user_filled}
                            tintColor={COLOURS.grey}
                            defaultValue={userData?.name}
                            value={name}
                            onChangeText={setName}
                        />
                    </FadeIn>
                    <FadeIn delay={250}>


                        <Input_Field backgroundColor={COLOURS.transparent} borderColor={COLOURS.light_grey}
                            borderWidth={responsiveWidth(.3)}
                            Input_marginTop={responsiveWidth(4)}
                            color={COLOURS.black}
                            maxLength={35}
                            Placeholder={'Your email'}
                            defaultValue={userData?.email}
                            first_inpt_Img={globalImages.envelope_filled}
                            tintColor={COLOURS.grey}
                            value={email}
                            onChangeText={setEmail}
                        />
                    </FadeIn>
                    <FadeIn delay={350}>

                        <Input_Field backgroundColor={COLOURS.transparent} borderColor={COLOURS.light_grey}
                            borderWidth={responsiveWidth(.3)}
                            Input_marginTop={responsiveWidth(4)}
                            color={COLOURS.black}
                            keyboardType={'numeric'}
                            Placeholder={'Your Phone'}
                            maxLength={12}
                            defaultValue={userData?.phone}
                            first_inpt_Img={globalImages.phone_filled}
                            tintColor={COLOURS.grey}
                            value={phone}
                            onChangeText={setPhone}
                        />

                    </FadeIn>

                    <FadeIn delay={450}>
                        <View style={styles.row_dob_gen}>
                            <View style={styles.inpt_view}>
                                <GenderPicker
                                    value={gender}
                                    onChange={(val) => setGender(val)}
                                />
                            </View>

                            <View style={styles.inpt_view}>
                                <DOBPicker
                                    value={dob}
                                    onChange={(date) => setDob(date)}
                                />
                            </View>
                        </View>
                    </FadeIn>

                    <FadeUp>
                        <Button label={'update'} alignSelf={'center'} marginTop={responsiveWidth(20)} />
                    </FadeUp>


                </View>
            </SafeAreaView >
        </>

    )
}

export default Edit_Profile

const styles = StyleSheet.create({


    row_dob_gen: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    inpt_view: {
        flexDirection: 'column',
        marginTop: responsiveWidth(6),
        justifyContent: 'space-between',
        marginHorizontal: responsiveWidth(2.5),
    },

    profile_here: {
        borderColor: COLOURS.green,
        borderWidth: responsiveWidth(.4),
        height: responsiveWidth(22),
        width: responsiveWidth(22),
        borderRadius: responsiveWidth(100)
    },

    container: {
        height: '100%',
        width: '100%',
    },

})