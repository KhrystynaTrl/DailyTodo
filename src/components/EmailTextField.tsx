import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import colors from "../theme/Colors";

type EmailTextFieldProps = {
  term: string;
  placeHolder: string;
  onTermChange: (text: string) => void;
  onValidateEmailAddress: () => void;
  error?: string;
};

const EmailTextField = ({
  term,
  placeHolder,
  onTermChange,
  onValidateEmailAddress,
  error,
}: EmailTextFieldProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <View>
      <Text style={styles.ErrorText}>{error}</Text>
      <View
        style={[styles.TextFieldView, isFocused && styles.TextFieldViewFocused]}
      >
        <TextInput
          autoCorrect={false}
          style={styles.TextField}
          placeholder={placeHolder}
          value={term}
          onChangeText={onTermChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onEndEditing={onValidateEmailAddress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  TextField: {
    fontSize: 24,
    flex: 1,
    marginHorizontal: 20,
  },
  TextFieldView: {
    width: "100%",
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 10,
    borderColor: colors.greenSages,
    borderWidth: 1,
    justifyContent: "center",
    backgroundColor: colors.greenLight,
  },
  TextFieldViewFocused: {
    borderColor: colors.greenLight,
    borderWidth: 2,
  },
  ErrorText: {
    fontSize: 12,
    color: "red",
    marginBottom: -5,
    marginHorizontal: 20,
  },
});

export default EmailTextField;
