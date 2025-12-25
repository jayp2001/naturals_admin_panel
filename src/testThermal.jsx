import React, { useEffect, useState } from 'react';
import Img1 from './assets/Qr.png';
// const usb = require('usb');
const PrintButton = () => {
    const [printer, setPrinter] = useState(null);
    const [printer2, setPrinter2] = useState(null);

    const handlePrintIp = () => {
        const GS = String.fromCharCode(29);
        const ESC = String.fromCharCode(27);
        let COMMAND = "";

        // COMMAND = ESC + "i";
        // COMMAND += GS + "V" + String.fromCharCode(1);
        COMMAND = ESC + "@";
        COMMAND += ESC + "a" + String.fromCharCode(1); // Center alignment

        // Your content goes here...

        // Perform a partial paper cut
        COMMAND += GS + "V" + String.fromCharCode(66) + String.fromCharCode(2);
        const encoder = new TextEncoder();
        const printData = `
  \x1B\x40   // ESC @ (initialize the printer)
  \x1B\x61\x01   // ESC a 1 (center align text)
  Restaurant Name\n
  --------------------------------\n
  \x1B\x61\x00   // ESC a 0 (left align text)
  Date: 2023-08-02\n
  Item 1 x 2  $10.00\n
  Item 2 x 1  $15.00\n
  --------------------------------\n
  Total: $35.00\n
  \n
  Thank you for dining with us!\n
  \n
`;
        const data = encoder.encode(printData + COMMAND);
        const sockket = new WebSocket('http://192.168.1.87:9100');
        sockket.onopen = () => {
            sockket.send(data)
        }
        sockket.onerror = (error) => {
            console.log('error', error)
        }
        // sockket.onopen = () => {
        //     sockket.send(data)
        // }

        // Replace with the IP address and port of your networked printer
        // const printerUrl = 'http://printer-ip-address:631/printers/YourPrinterName';

        // // Create an IPP client
        // const client = ipp.Printer(printerUrl);

        // // Create a print job request
        // const request = {
        //     'operation-attributes-tag': {
        //         'job-name': 'MyPrintJob',
        //         'document-format': 'application/octet-stream', // Replace with the appropriate format
        //     },
        //     data: 'Your print data goes here', // Replace with your data
        // };

        // Send the print job to the printer
        // client.execute('Print-Job', request, (err, response) => {
        //     if (!err) {
        //         console.log('Print job sent successfully');
        //     } else {
        //         console.error('Error sending print job:', err);
        //     }
        // });
    };

    useEffect(() => {

    }, []);
    async function requestPrinterAccess2() {
        try {
            // const usbDevices = await navigator.usb.getDevices();
            // console.log("devices", usbDevices[0].vendorId, usbDevices[0].productId)
            // Request access to USB devices with a specific vendor and product ID
            navigator.usb.requestDevice({ filters: [] })
                .then(async function (device) {
                    console.log(device);

                    // const usbDevice = await navigator.usb.requestDevice({
                    //     filters: [{ vendorId: device[0].vendorId, productId: device[0].productId }],
                    //     // filters: [{ vendorId: 0x04b8, productId: 0x0e11 }],
                    // });
                    // console.log('deviceRequest', usbDevice)
                    // Open the USB device
                    await device.open();

                    // Claim an interface (you may need to determine the correct interface)
                    await device.claimInterface(0);

                    setPrinter2(device);
                })
                .catch((error) => {
                    console.error('nodevice', error);
                })
        } catch (error) {
            console.error('Error accessing USB printer:', error);
        }
    }
    async function requestPrinterAccess() {
        try {
            // const usbDevices = await navigator.usb.getDevices();
            // console.log("devices", usbDevices[0].vendorId, usbDevices[0].productId)
            // Request access to USB devices with a specific vendor and product ID
            navigator.usb.requestDevice({ filters: [] })
                .then(async function (device) {
                    console.log(device);

                    // const usbDevice = await navigator.usb.requestDevice({
                    //     filters: [{ vendorId: device[0].vendorId, productId: device[0].productId }],
                    //     // filters: [{ vendorId: 0x04b8, productId: 0x0e11 }],
                    // });
                    // console.log('deviceRequest', usbDevice)
                    // Open the USB device
                    await device.open();

                    // Claim an interface (you may need to determine the correct interface)
                    await device.claimInterface(0);

                    setPrinter(device);
                })
                .catch((error) => {
                    console.error('nodevice', error);
                })
        } catch (error) {
            console.error('Error accessing USB printer:', error);
        }
    }
    // Check if WebUSB is supported

    async function getDeviceandConnect() {
        if ('usb' in navigator) {
            requestPrinterAccess();
        } else {
            console.error('WebUSB not supported in this browser');
        }
    }
    async function getDeviceandConnect2() {
        if ('usb' in navigator) {
            requestPrinterAccess2();
        } else {
            console.error('WebUSB not supported in this browser');
        }
    }

    const handlePrint = async () => {
        const GS = String.fromCharCode(29);
        const ESC = String.fromCharCode(27);
        let COMMAND = "";

        // COMMAND = ESC + "i";
        // COMMAND += GS + "V" + String.fromCharCode(1);
        COMMAND = ESC + "@";
        COMMAND += ESC + "a" + String.fromCharCode(1); // Center alignment

        // Your content goes here...

        // Perform a partial paper cut
        COMMAND += GS + "V" + String.fromCharCode(66) + String.fromCharCode(2);
        if (!printer) {
            console.error('No USB printer access granted');
            return;
        }
        try {
            const encoder = new TextEncoder();
            const printData = `
  \x1B\x40   // ESC @ (initialize the printer)
  \x1B\x61\x01   // ESC a 1 (center align text)
  Restaurant Name\n
  --------------------------------\n
  \x1B\x61\x00   // ESC a 0 (left align text)
  Date: 2023-08-02\n
  Item 1 x 2  $10.00\n
  Item 2 x 1  $15.00\n
  --------------------------------\n
  Total: $35.00\n
  \n
  Thank you for dining with us!\n
  \n
`;
            const data = encoder.encode(printData + COMMAND);
            console.log("command", encoder.encode(COMMAND))
            window.print(data);
            // await printer.transferOut(1, data); // Endpoint number may vary

            console.log('Print data sent to USB printer');
        } catch (error) {
            console.error('Error printing to USB printer:', error);
        }
    };
    const handlePrint2 = async () => {
        const GS = String.fromCharCode(29);
        const ESC = String.fromCharCode(27);
        let COMMAND = "";

        // COMMAND = ESC + "i";
        // COMMAND += GS + "V" + String.fromCharCode(1);
        COMMAND = ESC + "@";
        COMMAND += ESC + "a" + String.fromCharCode(1); // Center alignment

        // Your content goes here...

        // Perform a partial paper cut
        COMMAND += GS + "V" + String.fromCharCode(66) + String.fromCharCode(2);
        if (!printer2) {
            console.error('No USB printer access granted');
            return;
        }
        try {
            const encoder = new TextEncoder();
            const printData = `
  \x1B\x40   // ESC @ (initialize the printer)
  \x1B\x61\x01   // ESC a 1 (center align text)
  Restaurant Name\n
  --------------------------------\n
  \x1B\x61\x00   // ESC a 0 (left align text)
  Date: 2023-08-02\n
  Item 1 x 2  $10.00\n
  Item 2 x 1  $15.00\n
  --------------------------------\n
  Total: $35.00\n
  \n
  Thank you for dining with us!\n
  \n
`;
            const data = encoder.encode(printData + COMMAND);
            console.log("command", encoder.encode(COMMAND))
            await printer2.transferOut(1, data); // Endpoint number may vary

            console.log('Print data sent to USB printer');
        } catch (error) {
            console.error('Error printing to USB printer:', error);
        }
    };

    return (
        <div>
            <button onClick={getDeviceandConnect} >
                ભગવતી ફાસ્ટ ફૂડ
            </button>
            <hr />
            <button onClick={handlePrint} >
                Print
            </button>
            <hr />
            <button onClick={getDeviceandConnect2} >
                select Printer
            </button>
            <hr />
            <button onClick={handlePrint2} >
                Print
            </button>
            <hr />
            <button onClick={handlePrint2} >
                Print
            </button>
            <hr />
            <button onClick={handlePrintIp} >
                Print Ip
            </button>
        </div>
    );
};

export default PrintButton;
