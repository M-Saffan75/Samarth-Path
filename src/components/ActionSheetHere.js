import React, { useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import ActionSheet from "react-native-actions-sheet";

const ActionSheetHere = React.forwardRef((props, ref) => {
  const [comment, setComment] = useState("");

  const [comments, setComments] = useState([
    { id: 1, text: "Nice post 🔥" },
    { id: 2, text: "Amazing 😍" },
  ]);

  const sendComment = () => {
    if (!comment.trim()) return;

    setComments(prev => [
      { id: Date.now(), text: comment },
      ...prev,
    ]);

    setComment("");
  };

  return (
    <ActionSheet
      ref={ref}
      gestureEnabled={true}
      indicatorStyle={{ width: 40 }}
      containerStyle={{
        height: "80%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={{ padding: 15, borderBottomWidth: 1, borderColor: "#eee" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Comments
          </Text>
        </View>

        {/* List */}
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 15 }}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 8 }}>
              <Text style={{ fontSize: 15 }}>{item.text}</Text>
            </View>
          )}
        />

        {/* Input */}
        <View
          style={{
            flexDirection: "row",
            padding: 10,
            borderTopWidth: 1,
            borderColor: "#eee",
            alignItems: "center",
          }}
        >
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Write a comment..."
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 25,
              paddingHorizontal: 15,
              paddingVertical: 8,
            }}
          />

          <TouchableOpacity
            onPress={sendComment}
            style={{ marginLeft: 10 }}
          >
            <Text style={{ fontWeight: "bold" }}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ActionSheet>
  );
});

export default ActionSheetHere;