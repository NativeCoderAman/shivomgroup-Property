import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CopyRigthMessage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Copyright 2023-2024 @Shri Shivom technologies Pvt Ltd.</Text>
    </View>
  )
}

export default CopyRigthMessage

const styles = StyleSheet.create({
  container:{
    position:'absolute',
    bottom:10,
    width:'100%'
  },
  message:{
    fontSize:10,
    textAlign:'center'
  }
})