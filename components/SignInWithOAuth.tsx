import { defaultStyles } from '@/constants/Styles'
import { isClerkAPIResponseError, useOAuth } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import React, { useCallback } from 'react'
import { Alert, Text, TouchableOpacity } from 'react-native'
import { useWarmUpBrowser } from '../hooks/useWarmUpBrowser'

WebBrowser.maybeCompleteAuthSession()

type Props = {
  marginTop?: number
}

const SignInWithOAuth = ({ marginTop = 0 }: Props) => {
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWarmUpBrowser()

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow()

      if (createdSessionId) {
        await setActive!({ session: signIn!.createdSessionId })
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.log('OAuth error', JSON.stringify(err, null, 2))
      if (isClerkAPIResponseError(err)) {
        Alert.alert('Error', err.errors[0].message)
      }
    }
  }, [])

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        defaultStyles.pillButton,
        {
          flexDirection: 'row',
          gap: 16,
          marginTop: marginTop,
          backgroundColor: '#fff',
        },
      ]}>
      <Ionicons name="logo-google" size={24} color={'#000'} />
      <Text style={[defaultStyles.buttonText, { color: '#000' }]}>Continue with Google </Text>
    </TouchableOpacity>
  )
}
export default SignInWithOAuth
