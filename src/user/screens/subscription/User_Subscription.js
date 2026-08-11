import React, { useState } from 'react';
import RazorpayCheckout from 'react-native-razorpay';
import { useUser } from '../auth/user_context/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showError, showSuccess } from '../../../helper/Helper';
import { useTheme } from '../../../assets/themecontext/ThemeContext';


import Button from '../../../components/Button';
import ModalUse from '../../../components/ModalUse';
import UserRoutes from '../../user_routes/UserRoutes';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import ExplanationModal from '../../../components/ExplanationModal';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ActivityIndicator, ScrollView, } from 'react-native';
import { createSubscriptionOrder, buildRazorpayOptions, verifySubscriptionPayment, cancelSubscription, } from './subscription_backend/Subs_Backend';
import Title_Here from '../../../components/Title_Here';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserMe } from '../auth/auth_backend/Auth_Backend';

const FEATURES = [
  { icon: '📖', text: 'Daily Morning & Evening Texts' },
  { icon: '🧠', text: 'Afternoon Quiz Access' },
  { icon: '🏆', text: 'Weekly Leaderboard & Achievements' },
  { icon: '🎥', text: 'Exclusive Video Content' },
  { icon: '💬', text: 'Personal Guidance & Consultation' },
  { icon: '📚', text: 'Full Archives Access' },
];

const User_Subscription = ({ navigation }) => {

  const { userData, updateUser } = useUser();
  console.log('userData', userData)

  const { theme: COLOURS, isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false)
  const [cancelModal, setCancelModal] = useState(false)
  const isTrial = userData?.isTrial;
  const totalDays = isTrial ? 3 : 30;
  const endDate = isTrial
    ? new Date(userData?.subscription?.trialEndDate)
    : new Date(userData?.subscription?.expiryDate);
  const today = new Date();
  const daysLeft = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
  const isExpired = daysLeft <= 0;
  const cancelled = userData?.subscription?.status;

  const formattedExpiry = endDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const progressPercent = Math.max(0, Math.min(100, (daysLeft / totalDays) * 100));



  const handleSubscription = async () => {
    try {
      setLoading(true);
      const { token, orderData } = await createSubscriptionOrder();
      console.log('token, orderData<><><><>><<><<', token, orderData)
      const options = buildRazorpayOptions(orderData);
      options.prefill.contact = userData?.phone?.replace('+91', '') || '9999999999';
      options.prefill.name = userData?.name || 'User';
      const paymentData = await RazorpayCheckout.open(options);
      await verifySubscriptionPayment({ token, paymentData });
      navigation.replace(UserRoutes.Bottom_Navigation, {
        screen: UserRoutes.User_Profile,
      })
      showSuccess('Payment Successful 🎉');
      const user = await getUserMe(token);
      updateUser(user);
    } catch (error) {
      console.log(error);
      showError('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      setLoading(true);
      const res = await cancelSubscription();
      console.log('res?.message<><><><><>', res?.message)
      setMessage(res?.message || 'succes fully cancel your subscription')
      console.log('Cancelled Response:', res);
      const user = await getUserMe(token);
      updateUser(user);
      setCancelModal(false)
      setShowModal(true)
    } catch (error) {
      console.log(error);
      showError(error.message);
      setCancelModal(false)
    } finally {
      setLoading(false);
      setCancelModal(false)
    }
  };

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={COLOURS.light_primary}
      />
      <SafeAreaView style={[styles.safe, { backgroundColor: COLOURS.light_primary }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >


          <View style={styles.header}>
            <Text style={[styles.headerLabel, { color: COLOURS.primary }]}>
              SAMARTH PATH
            </Text>
            <Text style={[styles.headerTitle, { color: COLOURS.black }]}>Go Premium</Text>
            <Text style={[styles.headerSub, { color: COLOURS.grey }]}>
              Unlock your full spiritual journey
            </Text>
          </View>


          <View style={[styles.crownWrap, { backgroundColor: COLOURS.primary }]}>
            <Text style={styles.crownEmoji}>👑</Text>
          </View>
          {isExpired || userData.isSubscribed === false ?
            (
              <>
                <View style={[styles.planCard, { backgroundColor: COLOURS.white }]}>

                  <View style={styles.planTop}>
                    <View>
                      <Text style={[styles.planName, { color: COLOURS.black }]}>Premium Plan</Text>
                      <Text style={[styles.planDuration, { color: COLOURS.grey }]}>1 Month Access</Text>
                    </View>
                    <View style={[styles.priceBadge, { backgroundColor: COLOURS.primary }]}>
                      <Text style={styles.priceSymbol}>₹</Text>
                      <Text style={styles.priceAmount}>199</Text>
                      <Text style={styles.pricePer}>/mo</Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.featuresWrap}>
                    {FEATURES.map((f, i) => (
                      <View key={i} style={styles.featureRow}>
                        <Text style={styles.featureIcon}>{f.icon}</Text>
                        <Text style={[styles.featureText, { color: COLOURS.black }]}>{f.text}</Text>
                        <Text style={[styles.checkMark, { color: COLOURS.primary }]}>✓</Text>
                      </View>
                    ))}
                  </View>

                </View>

                <Text style={styles.note}>
                  Secure payment via Razorpay
                </Text>
                <TouchableOpacity style={[styles.ctaBtn, { backgroundColor: COLOURS.primary }, loading && styles.ctaBtnDisabled,]}
                  onPress={handleSubscription} disabled={loading} activeOpacity={0.85}>
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Text style={[styles.ctaText, { color: COLOURS.white }]}>Subscribe Now</Text>
                      <Text style={[styles.ctaSubText, { color: COLOURS.light_primary }]}>₹199 for 1 Month</Text>
                    </>
                  )}
                </TouchableOpacity>

                <Text style={[styles.secureText, { color: COLOURS.grey }]}>🔒 100% Secure & Encrypted</Text>

              </>

            ) : (
              <>
                {cancelled === 'cancelled' ? (
                  <>
                    <Title_Here title={'You will keep access until expiry date'} alignSelf={'center'} />
                    <Title_Here title={daysLeft + ' days Remaining'} alignSelf={'center'} />
                  </>
                ) : (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: isExpired ? '#FFE8E8' : '#E8F5E9' }
                      ]}>
                        <View style={[styles.statusDot, { backgroundColor: isExpired ? '#E53935' : '#43A047' }]} />
                        <Text style={[styles.statusText, { color: isExpired ? '#E53935' : '#43A047' }]}>
                          {isExpired ? 'Expired' : 'Active'}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.planCard, { backgroundColor: COLOURS.white }]}>
                      <View style={styles.planTop}>
                        <View>
                          <Text style={[styles.planName, { color: COLOURS.black }]}>{userData?.subscription?.planName}</Text>
                          <Text style={styles.planDuration}>Premium Access</Text>
                        </View>
                        <View style={[styles.priceBadge, { backgroundColor: COLOURS.primary ?? '#E07B39' }]}>
                          <Text style={styles.priceSymbol}>₹</Text>
                          <Text style={styles.priceAmount}>{userData?.subscription?.price}</Text>
                          <Text style={styles.pricePer}>{userData?.isTrial ? '/days' : '/mo'}</Text>
                        </View>
                      </View>

                      <View style={styles.divider} />

                      {/* Days Left Progress */}
                      <View style={styles.progressSection}>
                        <View style={styles.progressLabelRow}>
                          <Text style={styles.progressLabel}>Days Remaining</Text>
                          <Text style={[styles.progressDays, { color: COLOURS.primary ?? '#E07B39' }]}>
                            {isExpired ? '0' : daysLeft} days
                          </Text>
                        </View>
                        <View style={styles.progressBarBg}>
                          <View style={[
                            styles.progressBarFill,
                            {
                              width: `${progressPercent}%`,
                              backgroundColor: isExpired ? '#E53935' : (COLOURS.primary ?? '#E07B39'),
                            }
                          ]} />
                        </View>
                      </View>

                      <View style={styles.divider} />

                      {/* Expiry Info */}
                      <View style={styles.infoRow}>
                        <Text style={styles.infoIcon}>📅</Text>
                        <View>
                          <Text style={[styles.infoLabel, { color: COLOURS.grey }]}>Expiry Date</Text>
                          <Text style={[styles.infoValue, { color: COLOURS.black }]}>{formattedExpiry}</Text>
                        </View>
                      </View>

                      <View style={[styles.infoRow, { marginTop: 14 }]}>
                        <Text style={styles.infoIcon}>🎫</Text>
                        <View>
                          <Text style={[styles.infoLabel, { color: COLOURS.grey }]}>Plan</Text>
                          <Text style={[styles.infoValue, { color: COLOURS.black }]}>{userData?.subscription?.planName}</Text>
                        </View>
                      </View>
                    </View>

                    {!userData?.isTrial ? (<Button label={'cancel subscription ⛔'}
                      onPress={() => setCancelModal(true)}
                      alignSelf={'center'} backgroundColor={'#e5383522'}
                      borderColor={COLOURS.red} borderWidth={responsiveWidth(.4)}
                      color={COLOURS.black} borderRadius={responsiveWidth(100)} />) : ''}
                  </>
                )}
                <Text style={styles.secureText}>🔒 Secured by Razorpay</Text>
              </>
            )}


          <ModalUse
            label_1={loading ?
              <ActivityIndicator color="#fff" size="small" /> :
              'yes, cancel'}
            disabled={loading}
            label_2={'not now'}
            modalVisible={cancelModal}
            setModalVisible={setCancelModal}
            onPress={handleCancelSubscription}
            backgroundColor={isDark ? COLOURS.white : COLOURS.modal_bg}
            modal_text_one={'Cancel subscription?'}
            modal_text_two={'Are you sure you want to cancel subscription? This action cannot be undone.'}
          />

          <ExplanationModal
            visible={showModal}
            explanation={message}
            title={'Cancel Subscription'}
            onClose={() => setShowModal(false)}
            onPress={() =>
              navigation.replace(UserRoutes.Bottom_Navigation, {
                screen: UserRoutes.User_Profile,
              })}
          />

        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default User_Subscription;

const styles = StyleSheet.create({
  safe: { flex: 1 },

  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Header
  header: { alignItems: 'center', marginTop: 20, marginBottom: 10 },
  headerLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 2.5, marginBottom: 6 },
  headerTitle: { fontSize: 30, fontWeight: '800', color: '#1A1A1A', marginBottom: 6 },
  headerSub: { fontSize: 14, color: '#888' },

  // Crown
  crownWrap: {
    width: 70, height: 70, borderRadius: 35,
    alignItems: 'center', justifyContent: 'center',
    marginVertical: 20, alignSelf: 'center',
    shadowColor: '#E07B39',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 10, elevation: 8,
  },
  crownEmoji: { fontSize: 32 },

  // Status Badge
  statusBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 6,
    borderRadius: 20, marginBottom: 16, gap: 6,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: '700' },

  // Plan Card
  planCard: {
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    borderRadius: 20, padding: 22,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12,
    elevation: 5, marginBottom: 16,
  },
  planTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 18,
  },
  planName: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
  planDuration: { fontSize: 13, color: '#999', marginTop: 3 },
  priceBadge: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12,
  },
  priceSymbol: { color: '#fff', fontSize: 14, fontWeight: '700', marginBottom: 2 },
  priceAmount: { color: '#fff', fontSize: 26, fontWeight: '800', lineHeight: 30 },
  pricePer: { color: '#fff', fontSize: 12, marginBottom: 3, marginLeft: 1 },

  divider: { height: 1, backgroundColor: '#F0EDE8', marginBottom: 18 },

  // Progress
  progressSection: { marginBottom: 18 },
  progressLabelRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: { fontSize: 13, color: '#888', fontWeight: '500' },
  progressDays: { fontSize: 13, fontWeight: '700' },
  progressBarBg: {
    height: 8, backgroundColor: '#F0EDE8',
    borderRadius: 4, overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 4 },

  // Info rows
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  infoIcon: { fontSize: 22 },
  infoLabel: { fontSize: 12, color: '#AAA', fontWeight: '500' },
  infoValue: { fontSize: 15, color: '#1A1A1A', fontWeight: '600', marginTop: 2 },

  // Included title
  includedTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 14 },

  // Features
  featuresWrap: { gap: 14 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: { fontSize: 18, width: 26, textAlign: 'center' },
  featureText: { flex: 1, fontSize: 14, color: '#333', fontWeight: '500' },
  checkMark: { fontSize: 16, fontWeight: '700' },

  // Note
  note: { fontSize: 12, color: '#AAA', textAlign: 'center', marginBottom: 20 },

  // CTA
  ctaBtn: {
    alignSelf: 'center',
    width: '90%', paddingVertical: 17,
    borderRadius: 16, alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E07B39',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 10,
    elevation: 8, marginBottom: 14,
  },
  ctaBtnDisabled: { opacity: 0.7 },
  ctaText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 0.3 },
  ctaSubText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },

  secureText: { fontSize: 12, color: '#AAA', textAlign: 'center', marginTop: responsiveWidth(4) },
});