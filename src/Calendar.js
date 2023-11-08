import React from 'react';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import dayjs from 'dayjs';
import styled from 'styled-components/native';
import { SimpleLineIcons } from '@expo/vector-icons';

import { getDayText } from './util';

const ColumnView = styled.TouchableOpacity`
  width: ${(props) => props.columnSize}px;
  height: ${(props) => props.columnSize}px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.isSelected ? '#c2c2c2' : 'transparent'};
  border-radius: ${(props) => props.columnSize / 2}px;
`;

const ColumnText = styled.Text`
  color: ${(props) => props.isSunSat};
  opacity: ${(props) => (props.isCurrentMonth ? 1 : 0.4)};
  font-weight: ${(props) => (props.hasTodo ? 'bold' : 'normal')};
`;

const Column = ({
  text,
  isSunSat,
  isCurrentMonth,
  disabled,
  onPress,
  isSelected,
  hasTodo,
}) => {
  return (
    <ColumnView
      columnSize={35}
      disabled={disabled}
      onPress={onPress}
      isSelected={isSelected}
      hasTodo={hasTodo}
    >
      <ColumnText
        isSunSat={isSunSat}
        isCurrentMonth={isCurrentMonth}
        hasTodo={hasTodo}
      >
        {text}
      </ColumnText>
    </ColumnView>
  );
};

const ArrowButton = ({ iconName, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ paddingVertical: 15, paddingHorizontal: 20 }}
    >
      <SimpleLineIcons name={iconName} size={15} color="#404040" />
    </TouchableOpacity>
  );
};

export default ({
  columns,
  selectedDate,
  setSelectedDate,
  onPressArrow,
  showDatePicker,
  todoList,
}) => {
  const ListHeaderComponent = () => {
    const currentDateText = dayjs(selectedDate).format('YYYY-MM-DD');

    return (
      <View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          <ArrowButton
            iconName="arrow-left"
            onPress={() => onPressArrow('left')}
          />

          <TouchableOpacity onPress={showDatePicker}>
            <Text style={{ fontSize: 20, color: '#404040' }}>
              {currentDateText}
            </Text>
          </TouchableOpacity>

          <ArrowButton
            iconName="arrow-right"
            onPress={() => onPressArrow('right')}
          />
        </View>

        <View style={{ flexDirection: 'row' }}>
          {[0, 1, 2, 3, 4, 5, 6].map((day) => {
            const isSunSat =
              day === 0 ? '#e67639' : day === 6 ? '#5872d1' : '#2b2b2b';
            return (
              <Column
                key={`day-${day}`}
                text={getDayText(day)}
                isSunSat={isSunSat}
                isCurrentMonth={true}
                disabled={true}
              />
            );
          })}
        </View>
      </View>
    );
  };

  const renderItem = ({ item: date }) => {
    const dateText = dayjs(date).get('date');

    const day = dayjs(date).get('day');

    const isSunSat = day === 0 ? '#e67639' : day === 6 ? '#5872d1' : '#2b2b2b';

    const isCurrentMonth = dayjs(date).isSame(selectedDate, 'month');

    const isSelected = dayjs(date).isSame(selectedDate, 'date');

    const hasTodo = todoList.find(
      (todo) =>
        dayjs(todo.date).format('YYYY-MM-DD') ===
        dayjs(date).format('YYYY-MM-DD')
    );

    const onPress = () => {
      setSelectedDate(date);
    };

    return (
      <Column
        text={dateText}
        isSunSat={isSunSat}
        isCurrentMonth={isCurrentMonth}
        onPress={onPress}
        isSelected={isSelected}
        hasTodo={hasTodo}
      />
    );
  };

  return (
    <FlatList
      data={columns}
      scrollEnabled={false}
      keyExtractor={(_, index) => index}
      renderItem={renderItem}
      numColumns={7}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
};
