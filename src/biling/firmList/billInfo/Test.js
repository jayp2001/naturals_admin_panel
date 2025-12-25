<Modal
open={infoPopUpOpen}
onClose={() => setInfoPopUpOpen(false)}
aria-labelledby="modal-modal-title"
aria-describedby="modal-modal-description"
disableAutoFocus
>
<Box sx={style} className='rounded-md border-none'>
    <div className="px-4 pb-4">
        <div className="bg-gray-200 py-3 px-1 rounded-b-md">
            <div className="billData flex justify-between px-2 items-center">
                <div className="InfoFirmName">{infoPopUpData?.firmData?.firmName}</div>
                <div className="billInformation ">
                    <div className="billNumber">BILL: {infoPopUpData?.billNumber}</div>
                    {/* <Divider orientation="vertical" flexItem /> */}
                </div>
            </div>
            <div className="flex justify-between px-2 items-center">
                <div className="InfoBillType mt-2 ">{infoPopUpData?.billType}</div>
                <div className="bg-gray-500 p-1 px-2 text-white mt-3 rounded-md text-md">
                    {infoPopUpData?.billPayType}
                </div>
            </div>
        </div>
        <div className="p-2 flex items-center gap-1">
            <PersonIcon />{infoPopUpData?.cashier}
        </div>
        <div className="border w-full"></div>
        <div className="customerDetails p-2">
            <div className="text-md font-semibold">
                Customer Details
            </div>
            {infoPopUpData?.customerDetails && infoPopUpData?.customerDetails?.customerName && (
                <div className="customerName my-1">{infoPopUpData?.customerDetails?.customerName}</div>
            )}
            {infoPopUpData?.customerDetails && infoPopUpData?.customerDetails?.mobileNo && (
                <div className="customerName my-1">{infoPopUpData?.customerDetails?.mobileNo}</div>
            )}
            {infoPopUpData?.customerDetails && infoPopUpData?.customerDetails?.address && (
                <div className="customerName my-1">{infoPopUpData?.customerDetails?.address}</div>
            )}
        </div>
        <div className="border w-full"></div>
        <div className="ItemDetails p-2">
            <div className="text-md font-semibold">
                Item Details
            </div>
            {infoPopUpData?.itemData && infoPopUpData?.itemData?.map((item, index) => (
                <div key={index} className="max-h-56 overflow-auto" >
                    {item.qty}x {item.itemName} ({item.unit})
                </div>
            ))}
            <div className="my-2  border-gray-300 itemCustomheight">
                <div className="flex flex-wrap items-center mb-2">
                    {infoPopUpData?.itemData.map((item, index) => (
                        <div
                            key={index}
                            className="my-2 text-xs font-semibold w-2/4"
                        >
                            <li>{item.qty}x {item.itemName} ({item.unit})</li>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div className="border w-full"></div>
        <div className="text-end flex items-center justify-end my-2 mt-4">Total Amount: <CurrencyRupeeIcon className="BackArrowIcon" />{infoPopUpData?.totalAmount}</div>
        <div className="border w-full"></div>
        <div className="flex items-center justify-end mt-4">
            <div
                className=" bg-white cursor-pointer border-black flex items-center justify-center BackArroIconDiv  w-20 gap-2 rounded-lg border"
                onClick={() => setInfoPopUpOpen(false)}
            >
                Close
            </div>
        </div>
    </div>
</Box>
</Modal>