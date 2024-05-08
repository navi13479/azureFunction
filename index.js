const { InfluxDB, Point, WritePrecision } = require("@influxdata/influxdb-client");

module.exports = async function (context, message) {
    context.log("JavaScript IoT Hub trigger function processed message");

    // Retrieve the InfluxDB configuration
    const influxDBUrl = "https://eu-central-1-1.aws.cloud2.influxdata.com/";
    const influxDBToken = "DoBFx6g_SdgVj6aygH8_Phng_8Bxo_7gDCscHcKfO5PpUttyAneJUqSLecwLJugTMOtcO-A9syxHhkiFcbzf4g==";
    const influxDBBucket = "Storage";
    const influxDBOrg = "IOTTUKECS";

    // Extract temperature from the IoT message
    const temperature = parseFloat(message.body);

    // Create a data point
    const point = new Point("iot_data")
        .tag("device_id", "device123")
        .floatField("temperature", temperature)
        .timestamp(new Date(), WritePrecision.NS);

    // Create InfluxDB client
    const influxDBClient = new InfluxDB({ url: influxDBUrl, token: influxDBToken });

    // Write the data point to InfluxDB
    const writeApi = influxDBClient.getWriteApi(influxDBOrg, influxDBBucket);
    writeApi.writePoint(point);
    await writeApi.close();

    context.done();
};
