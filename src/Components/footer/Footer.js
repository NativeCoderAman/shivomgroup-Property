import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../../Utils/Colors'

const Footer = ({message}) => {
  return (
    <View style={styles.container}>
      <Text style={ styles.text }>{message || `no more data`}</Text>
    </View>
  )
}

export default Footer

const styles = StyleSheet.create({
    container:{
        width: '100%',
        marginTop:'5%',
        marginBottom:'25%'    
    },
    text:{
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.orange,
        textTransform:'capitalize'
    }
})