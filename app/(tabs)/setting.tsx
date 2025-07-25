import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { StyleSheet, View, Alert } from 'react-native'
import { Button, TextInput, PaperProvider } from 'react-native-paper'
import { Session } from '@supabase/supabase-js'

export default function Setting({ session }: { session: Session }) {
  return (
    <View style={styles.container}>
      <View style={styles.verticallySpaced}>

          <Button mode="outlined"
                onPress={() => supabase.auth.signOut()}>
                Sign Out
          </Button>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
})