import React, { useMemo, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { fontSize } from '../../Utils/Size';
import { colors } from '../../Utils/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../Utils/Metrics';

const AutoSuggestInputCard = ({
  title,
  name,
  value,
  placeholder,
  secureTextEntry,
  updateFields,
  onBlur,
  onFocus,
  keyboardType,
  editable,
  error,
  suggestions = [],
  onCountrySelect,
  onSateSelect
}) => {
  const [query, setQuery] = useState(value || ''); // Initialize query with value if available
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
  useEffect(() => {
    // Initially set all suggestions when the component mounts
    setFilteredSuggestions(suggestions);
  }, [suggestions]);

  useEffect(() => {
    // Reset the query when the parent resets Formik values
    setQuery(value || ''); // Reset to new value from props
  }, [value]); // This effect runs when value changes

  const handleChangeText = (text) => {
    setQuery(text);
    updateFields && updateFields({ [name]: text });

    // Filter suggestions based on input
    if (text) {
      const filtered = suggestions.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      // If the input is cleared, show all suggestions again
      setFilteredSuggestions(suggestions);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion);
    updateFields && updateFields({ [name]: suggestion });
    setFilteredSuggestions([]); // Hide suggestions after selection
    if (name === 'parentAddressCountry' || name === 'guardianAddressCountry' || name === 'country' || name === 'guardianCountry' || name === 'guardian_country' || name === 'parent_country') {
      onCountrySelect(suggestion);
    } else if (name === 'state' || name === 'guardianAddressState' || name === 'state' || name === 'guardianState' || name === 'guardian_state' || name === 'parent_state') {
      onSateSelect(suggestion);
    }
  };

  return useMemo(
    () => (
      <View style={styles.inputcard}>
        {title && <Text style={styles.inptitle}>{title}</Text>}
        <View style={styles.inputView}>
          <TextInput
            placeholder={placeholder}
            placeholderTextColor={colors.grey}
            value={query} // Reflect the current query state
            onChangeText={handleChangeText}
            onBlur={onBlur}
            onFocus={onFocus} // Handle focus event
            keyboardType={keyboardType ? keyboardType : 'default'}
            editable={editable}
            secureTextEntry={secureTextEntry} // Pass secureTextEntry if needed
            style={styles.inputStyle}
          />
        </View>

        {error && <Text style={styles.error}>{error}</Text>}


        {/* Suggestions Dropdown */}
        {filteredSuggestions.length > 0 && (
          <FlatList
            data={filteredSuggestions}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectSuggestion(item)}>
                <Text style={styles.suggestionItem}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            style={styles.suggestionList}
            scrollEnabled={true}
            showsVerticalScrollIndicator={true} // Show vertical scroll indicator
            nestedScrollEnabled={true} // Enable nested scrolling
          />
        )}

      </View>
    ),
    [title, name, query, placeholder, filteredSuggestions, secureTextEntry, updateFields, error]
  );
};

export default AutoSuggestInputCard;

const styles = StyleSheet.create({
  inputcard: {
    gap: verticalScale(3),
  },
  inptitle: {
    fontSize: fontSize.lable,
    color: colors.black,
    fontWeight: '600',
    fontFamily: 'Roboto-Regular',
    textTransform: 'capitalize',
  },
  inputView: {
    width: '100%',
    borderWidth: 0.5,
    backgroundColor: colors.white,
    borderColor: colors.grey,
    borderRadius: horizontalScale(4),
    paddingHorizontal: horizontalScale(12),
  },
  inputStyle: {
    color: colors.txtgrey,
    fontSize: moderateScale(14),
    width: '100%',
    paddingLeft: 12,
    borderWidth: 1,
    borderColor: colors.white,
    height: verticalScale(50),
  },
  suggestionList: {
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.grey,
    borderRadius: horizontalScale(4),
    overflow: 'hidden',
  },
  suggestionItem: {
    padding: verticalScale(10),
    fontSize: moderateScale(14),
    color: colors.black,
  },
  separator: {
    height: 1,
    backgroundColor: colors.grey,
  },
  error: {
    color: colors.red,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
});
