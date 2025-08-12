import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const Skeleton = () => {
    return (
        <View>
            <SkeletonPlaceholder borderRadius={8}>
                <View style={{ flexDirection: "row"  ,marginTop:80,height:150}}>
                    <View style={{ marginLeft: 20, width: 250 }}>
                        <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                            <View style={{ height: 50, width: 90, borderRadius: 10 }}></View>
                            <View style={{ height: 50, width: 90, borderRadius: 10 }}></View>
                        </View>
                        <View style={{ width: 200, height: 20, borderRadius: 10, marginTop: 15 }}></View>
                        <View style={{ width: 150, height: 20, borderRadius: 10, marginTop: 15 }}></View>
                    </View>
                    <View style={{ marginLeft: 20, width: 250 }}>
                        <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                            <View style={{ height: 50, width: 90, borderRadius: 10 }}></View>
                            <View style={{ height: 50, width: 90, borderRadius: 10 }}></View>
                        </View>
                        <View style={{ width: 200, height: 20, borderRadius: 10, marginTop: 15 }}></View>
                        <View style={{ width: 150, height: 20, borderRadius: 10, marginTop: 15 }}></View>
                    </View>
                </View>
            </SkeletonPlaceholder>

            <SkeletonPlaceholder borderRadius={8}>
                <View style={{ width: "90%", marginHorizontal: "5%", marginTop: 50 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                        <View style={{ width: 90, height: 50, borderRadius: 10 }}></View>
                        <View style={{ width: 90, height: 50, borderRadius: 10 }}></View>
                        <View style={{ width: 90, height: 50, borderRadius: 10 }}></View>
                    </View>
                    <View style={{ width: "100%", marginHorizontal: "auto", height: 20, borderRadius: 15, marginTop: 20 }}></View>
                    <View style={{ width: "90%", marginHorizontal: "auto", height: 10, borderRadius: 15, marginTop: 20 }}></View>
                    <View style={{ width: "90%", marginHorizontal: "auto", height: 10, borderRadius: 15, marginTop: 20 }}></View>
                    <View style={{ width: "90%", marginHorizontal: "auto", height: 10, borderRadius: 15, marginTop: 20 }}></View>
                </View>
            </SkeletonPlaceholder>
            <SkeletonPlaceholder borderRadius={8}>
                <View style={{ width: "90%", marginHorizontal: "5%", marginTop: 50, height: 200 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                        <View style={{ width: 90, height: 50, borderRadius: 10 }}></View>
                        <View style={{ width: 90, height: 50, borderRadius: 10 }}></View>
                        <View style={{ width: 90, height: 50, borderRadius: 10 }}></View>
                    </View>
                    <View style={{ width: "100%", marginHorizontal: "auto", height: 20, borderRadius: 15, marginTop: 20 }}></View>
                    <View style={{ width: "90%", marginHorizontal: "auto", height: 10, borderRadius: 15, marginTop: 20 }}></View>
                    <View style={{ width: "90%", marginHorizontal: "auto", height: 10, borderRadius: 15, marginTop: 20 }}></View>
                    <View style={{ width: "90%", marginHorizontal: "auto", height: 10, borderRadius: 15, marginTop: 20 }}></View>
                </View>
            </SkeletonPlaceholder>
        </View>
    )
}

export default Skeleton

const styles = StyleSheet.create({})