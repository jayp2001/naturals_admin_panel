import React, { useState, useEffect } from 'react';

const PrinterComponent = () => {
    const [message, setMessage] = useState('');
    const [ws, setWs] = useState(null);

    useEffect(() => {
        // Establish WebSocket connection when the component mounts
        const printerIP = '192.168.1.87';
        const printerPort = '9100';

        const wsUrl = `ws://${printerIP}:${printerPort}`;
        const wsConnection = new WebSocket(wsUrl);

        wsConnection.onopen = () => {
            setWs(wsConnection);
        };

        wsConnection.onmessage = (event) => {
            console.log('Received message from printer:', event.data);
        };

        wsConnection.onclose = () => {
            console.log('Connection to printer closed.');
        };

        wsConnection.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        return () => {
            // Close WebSocket connection when the component unmounts
            if (wsConnection.readyState === WebSocket.OPEN) {
                wsConnection.close();
            }
        };
    }, []);

    const printData = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            // Modify the printData as a string
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

            // Send the modified printData to the printer
            ws.send(printData);
        }
    };

    return (
        <div>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={printData}>Print</button>
        </div>
    );
};

export default PrinterComponent;
