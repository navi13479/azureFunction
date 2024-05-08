import { InfluxDBClient, Point } from '@influxdata/influxdb3-client';

const token = 'VGrlyHKk7ChBB9x-amY86GEv5X44yTpLT4kIAS-7d1qO95a9BDemZWlvUMrH_wVHCWGN6BWSQIHH7xWS0I84Qw==';
const influxDBUrl = 'https://eu-central-1-1.aws.cloud2.influxdata.com/'; // e.g., https://eu-central-1-1.aws.cloud2.influxdata.com/

const client = new InfluxDBClient({ url: influxDBUrl, token: token });

module.exports = async function (context, IoTHubMessages) {
    context.log('JavaScript event received:', JSON.stringify(IoTHubMessages, null, 2));

    const database = 'Storage'; // e.g., 'Storage'

    for (const message of IoTHubMessages) {
        const deviceId = message.deviceId;
        const temperature = message.temperature;
        const humidity = message.humidity;

        const point = new Point('census')
            .tag('deviceId', deviceId)
            .floatField('temperature', temperature)
            .floatField('humidity', humidity);

        try {
            await client.write(point, database);
            context.log('Data written to InfluxDB successfully.');
        } catch (error) {
            context.error('Error writing data to InfluxDB:', error);
        }
    }
};
