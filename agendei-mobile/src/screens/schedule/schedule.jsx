import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { styles } from './schedule.style';
import { ptBR } from '../../constants/calendar';
import { Picker } from '@react-native-picker/picker';
import Button from '../../components/button/button';
import api from '../../constants/api';

LocaleConfig.locales['pt-br'] = ptBR;
LocaleConfig.defaultLocale = 'pt-br';

function Schedule(props) {
  const id_doctor = props.route.params.id_doctor;
  const id_service = props.route.params.id_service;

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState('');

  async function ClickBooking() {
    try {
      const response = await api.post('/appointments', {
        id_doctor: id_doctor,
        id_service: id_service,
        booking_date: selectedDate,
        booking_hour: selectedHour,
      });

      if (response.data?.id_appointment) {
        props.navigation.popToTop();
      }
    } catch (error) {
      if (error.response?.data.error) {
        Alert.alert(error.response.data.error);
      } else {
        Alert.alert('Ocorreu um erro. Tente novamente mais tarde');
      }
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Calendar
          theme={styles.theme}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
          }}
          markedDates={{
            [selectedDate]: { selected: true },
          }}
          minDate={new Date().toDateString()}
        />

        <View>
          <Text style={styles.textHour}>Horário</Text>
        </View>

        <View>
          <Picker
            selectedValue={selectedHour}
            onValueChange={(itemValue, _itemIndex) => {
              setSelectedHour(itemValue);
            }}
          >
            <Picker.Item label='09:00' value='09:00' />
            <Picker.Item label='09:30' value='09:30' />
            <Picker.Item label='10:00' value='10:00' />
          </Picker>
        </View>
      </View>

      <View>
        <Button text='Confirmar Reserva' onPress={ClickBooking} />
      </View>
    </View>
  );
}

export default Schedule;
