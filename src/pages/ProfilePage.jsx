import React, { useState } from 'react';
import TopNavBar from '../components/TopNavBar'; 

// Icons
import userIcon from '../assets/icons/user.svg';
import phoneIcon from '../assets/icons/phone.svg';
import mailIcon from '../assets/icons/mail.svg';
import mapPinIcon from '../assets/icons/map-pin.svg';
import lockIcon from '../assets/icons/lock.svg';
import crownIcon from '../assets/icons/iconcrown.svg'; 
import penIcon from '../assets/icons/pen-line.svg';
import copyIcon from '../assets/icons/gamepad.svg'; 
import saveIcon from '../assets/icons/save.svg';
import xIcon from '../assets/icons/x.svg';

// Images
import profileImg from '../assets/images/profile.png'; 

function ProfilePage() {
    // State for User Data
    const [userData, setUserData] = useState({
        name: "احمد محمود",
        phone: "+412 767-878",
        email: "infoname@gmail.com",
        address: "street addres- 124",
        password: "****************",
        planType: "سنوي",
        planEndDate: "2025-03-15"
    });

    // Editing states
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [isEditingPlan, setIsEditingPlan] = useState(false);

    // Temp states
    const [editInfoData, setEditInfoData] = useState({ ...userData });
    const [editPasswordData, setEditPasswordData] = useState({ password: userData.password });
    const [editPlanData, setEditPlanData] = useState({ planType: userData.planType, planEndDate: userData.planEndDate });

    // Handlers for Personal Info
    const handleEditInfoClick = () => {
        setEditInfoData({ ...userData });
        setIsEditingInfo(true);
    };
    const handleSaveInfo = () => {
        setUserData({ ...userData, ...editInfoData });
        setIsEditingInfo(false);
    };
    const handleCancelInfo = () => setIsEditingInfo(false);
    const handleInfoChange = (e) => setEditInfoData({ ...editInfoData, [e.target.name]: e.target.value });

    // Handlers for Password
    const handleEditPasswordClick = () => {
        setEditPasswordData({ password: userData.password });
        setIsEditingPassword(true);
    };
    const handleSavePassword = () => {
        setUserData({ ...userData, ...editPasswordData });
        setIsEditingPassword(false);
    };
    const handleCancelPassword = () => setIsEditingPassword(false);
    const handlePasswordChange = (e) => setEditPasswordData({ ...editPasswordData, [e.target.name]: e.target.value });

    // Handlers for Plan
    const handleEditPlanClick = () => {
        setEditPlanData({ planType: userData.planType, planEndDate: userData.planEndDate });
        setIsEditingPlan(true);
    };
    const handleSavePlan = () => {
        setUserData({ ...userData, ...editPlanData });
        setIsEditingPlan(false);
    };
    const handleCancelPlan = () => setIsEditingPlan(false);
    const handlePlanChange = (e) => setEditPlanData({ ...editPlanData, [e.target.name]: e.target.value });

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert("تم نسخ الرابط بنجاح!");
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    // Shared style for labels
    const labelStyle = {
        fontFamily: '"IBM Plex Sans Arabic", sans-serif',
        fontWeight: 400,
        fontStyle: 'normal',
        fontSize: '16px',
        lineHeight: '100%',
        textAlign: 'center',
        color: '#000000',
    };

    // Shared style for buttons
    const actionButtonStyle = {
        width: '137px',
        height: '52px',
        borderRadius: '60.5px',
        padding: '14px',
        gap: '6px',
        fontFamily: '"IBM Plex Sans Arabic", sans-serif',
        fontWeight: 600,
        fontStyle: 'normal',
        fontSize: '16px',
        lineHeight: '100%',
        letterSpacing: '0%',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };


  return (
        <div className="min-h-screen bg-white font-sans" dir="rtl">
            {/* Hero Section */}
            <div className="relative w-full h-[350px] mb-32">
                <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center rounded-b-[50px] overflow-hidden"
                    style={{ 
                        backgroundImage: 'url("/images/bg-map.png")',
                        backgroundColor: '#4F67BD' 
                    }}
                >
                    <div className="absolute inset-0 bg-black/10"></div>
                </div>

                <div className="absolute top-0 left-0 w-full z-50 p-4 md:p-8 flex justify-between items-start">
                     <div className="bg-white rounded-full p-1.5 pl-4 pr-1.5 flex items-center shadow-md gap-4">
                         <div className="bg-[#C07749] text-white px-5 py-1.5 rounded-full font-bold text-sm flex items-center justify-center min-w-[90px]">
                            <span>500 نقطة</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-800 text-sm md:text-base">أحمد محمود</span>
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100">
                               <img src="https://i.pravatar.cc/150?img=12" alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                         </div>
                     </div>

                     <button className="bg-white w-12 h-12 rounded-full shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                       </svg>
                     </button>
                </div>

                <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-30">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                        <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <h2 className="mt-3 text-xl font-bold text-gray-800">احمد محمود</h2>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="container mx-auto px-4 pb-12 max-w-[80rem] mt-[35px]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-[8rem] items-start">
                    
                    {/* RIGHT COLUMN (In RTL, visually first): Info Cards */}
                    <div className="w-full space-y-4">
                        
                        {/* Card 1: Personal Info */}
                        <div className="bg-white rounded-[14px] shadow-sm border border-[#EAEAEA] overflow-hidden">
                            <div className="flex items-center justify-between rounded-b-[14px] p-4 bg-[#F6F6F6] border-b border-[#EAEAEA] flex-wrap gap-2">
                                <h3 className="font-bold text-gray-800">المعلومات الشخصية</h3>
                                {isEditingInfo ? (
                                    <div className="flex gap-2 flex-wrap">
                                        <button onClick={handleSaveInfo} style={actionButtonStyle} className="bg-[#4F67BD] text-white hover:bg-[#3e539a] transition-colors">
                                            <img src={saveIcon} alt="save" className="w-5 h-5" />
                                            <span>حفظ</span>
                                        </button>
                                        <button onClick={handleCancelInfo} style={actionButtonStyle} className="bg-[#D02857] text-white hover:bg-[#b02249] transition-colors">
                                            <img src={xIcon} alt="cancel" className="w-5 h-5" />
                                            <span>عدم الحفظ</span>
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={handleEditInfoClick} className="w-8 h-8 bg-white border border-[#EAEAEA] rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                                        <img src={penIcon} alt="Edit" className="w-4 h-4 text-gray-800" />
                                    </button>
                                )}
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 w-32">
                                        <img src={userIcon} alt="" className="w-5 h-5 opacity-60" />
                                        <span style={labelStyle}>الاسم</span>
                                    </div>
                                    {isEditingInfo ? 
                                        <input type="text" name="name" value={editInfoData.name} onChange={handleInfoChange} className="border p-1 rounded text-left w-full mr-4" /> : 
                                        <span className="font-bold text-gray-800 text-left flex-1">{userData.name}</span>
                                    }
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 w-32">
                                        <img src={phoneIcon} alt="" className="w-5 h-5 opacity-60" />
                                        <span style={labelStyle}>رقم الهاتف</span>
                                    </div>
                                    {isEditingInfo ? 
                                        <input type="text" name="phone" value={editInfoData.phone} onChange={handleInfoChange} className="border p-1 rounded text-left w-full mr-4" dir="ltr" /> : 
                                        <span className="font-bold text-gray-800 text-left flex-1" dir="ltr">{userData.phone}</span>
                                    }
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 w-32">
                                        <img src={mailIcon} alt="" className="w-5 h-5 opacity-60" />
                                        <span style={labelStyle}>البريد الالكتروني</span>
                                    </div>
                                    {isEditingInfo ? 
                                        <input type="email" name="email" value={editInfoData.email} onChange={handleInfoChange} className="border p-1 rounded text-left w-full mr-4" dir="ltr" /> : 
                                        <span className="font-bold text-gray-800 text-left flex-1 truncate" dir="ltr">{userData.email}</span>
                                    }
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 w-32">
                                        <img src={mapPinIcon} alt="" className="w-5 h-5 opacity-60" />
                                        <span style={labelStyle}>العنوان</span>
                                    </div>
                                    {isEditingInfo ? 
                                        <input type="text" name="address" value={editInfoData.address} onChange={handleInfoChange} className="border p-1 rounded text-left w-full mr-4" dir="ltr" /> : 
                                        <span className="font-bold text-gray-800 text-left flex-1" dir="ltr">{userData.address}</span>
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Password */}
                        <div className="bg-white rounded-[14px] shadow-sm border border-[#EAEAEA] overflow-hidden">
                            <div className="flex items-center justify-between p-4 rounded-b-[14px] bg-[#F6F6F6] border-b border-[#EAEAEA] flex-wrap gap-2">
                                <h3 className="font-bold text-gray-800">كلمة السر</h3>
                                {isEditingPassword ? (
                                    <div className="flex gap-2 flex-wrap">
                                        <button onClick={handleSavePassword} style={actionButtonStyle} className="bg-[#4F67BD] text-white hover:bg-[#3e539a] transition-colors">
                                            <img src={saveIcon} alt="save" className="w-5 h-5" />
                                            <span>حفظ</span>
                                        </button>
                                        <button onClick={handleCancelPassword} style={actionButtonStyle} className="bg-[#D02857] text-white hover:bg-[#b02249] transition-colors">
                                            <img src={xIcon} alt="cancel" className="w-5 h-5" />
                                            <span>عدم الحفظ</span>
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={handleEditPasswordClick} className="w-8 h-8 bg-white border border-[#EAEAEA] rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                                        <img src={penIcon} alt="Edit" className="w-4 h-4 text-gray-800" />
                                    </button>
                                )}
                            </div>
                            <div className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-3 w-32">
                                    <img src={lockIcon} alt="" className="w-5 h-5 opacity-60" />
                                    <span style={labelStyle}>كلمة السر</span>
                                </div>
                                {isEditingPassword ? 
                                    <input type="password" name="password" placeholder="New Password" onChange={handlePasswordChange} className="border p-1 rounded text-left w-full mr-4" /> :
                                    <span className="font-bold text-gray-800 text-xl pt-2 text-left flex-1" dir="ltr">****************</span>
                                }
                            </div>
                        </div>

                        {/* Card 3: Subscription Plan */}
                        <div className="bg-white rounded-[14px] shadow-sm border border-[#EAEAEA] overflow-hidden">
                            <div className="flex items-center justify-between p-4 rounded-b-[14px] bg-[#F6F6F6] border-b border-[#EAEAEA] flex-wrap gap-2">
                                <h3 className="font-bold text-gray-800">خطة الاشتراك</h3>
                                {isEditingPlan ? (
                                    <div className="flex gap-2 flex-wrap">
                                        <button onClick={handleSavePlan} style={actionButtonStyle} className="bg-[#4F67BD] text-white hover:bg-[#3e539a] transition-colors">
                                            <img src={saveIcon} alt="save" className="w-5 h-5" />
                                            <span>حفظ</span>
                                        </button>
                                        <button onClick={handleCancelPlan} style={actionButtonStyle} className="bg-[#D02857] text-white hover:bg-[#b02249] transition-colors">
                                            <img src={xIcon} alt="cancel" className="w-5 h-5" />
                                            <span>عدم الحفظ</span>
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={handleEditPlanClick} className="w-8 h-8 bg-white border border-[#EAEAEA] rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                                        <img src={penIcon} alt="Edit" className="w-4 h-4 text-gray-800" />
                                    </button>
                                )}
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 w-32">
                                        <img src={crownIcon} alt="" className="w-5 h-5 text-yellow-500" />
                                        <span style={labelStyle}>نوع الاشتراك</span>
                                    </div>
                                    {isEditingPlan ?
                                        <input type="text" name="planType" value={editPlanData.planType} onChange={handlePlanChange} className="border p-1 rounded text-left w-full mr-4" /> :
                                        <span className="font-bold text-gray-800 text-left flex-1">{userData.planType}</span>
                                    }
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 w-auto min-w-[140px]"> 
                                        <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span style={labelStyle} className="whitespace-nowrap">تاريخ نهاية الاشتراك</span>
                                    </div>
                                    {isEditingPlan ?
                                        <input type="date" name="planEndDate" value={editPlanData.planEndDate} onChange={handlePlanChange} className="border p-1 rounded text-left w-full mr-4" /> :
                                        <span className="font-bold text-gray-800 text-left flex-1" dir="ltr">{userData.planEndDate}</span>
                                    }
                                </div>
                                
                                <div className="relative w-full h-2 bg-gray-200 rounded-full mt-2">
                                    <div className="absolute right-0 top-0 h-full bg-[#4F67BD] rounded-full w-3/4"></div>
                                    <div className="absolute right-[75%] top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#4F67BD] rounded-full border-2 border-white shadow"></div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* LEFT COLUMN (Second visually in RTL): Marketing Card */}
                    <div className="w-full">
                        <div className="bg-white rounded-[14px] shadow-sm border border-[#EAEAEA] overflow-hidden">
                            <div className="bg-[#4F67BD] p-4 flex rounded-b-[14px] items-center justify-between text-white">
                                
                                <span className="font-bold text-sm whitespace-nowrap ml-4">رابط التسويق</span>

                                <button 
                                    onClick={() => copyToClipboard("https://www.ifjvpmqvxfwt56.....")}
                                    className="hover:bg-gray-50 transition-colors"
                                    style={{
                                        width: '281px',
                                        height: '48px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        borderRadius: '60px',
                                        borderWidth: '2px',
                                        borderColor: 'white', 
                                        padding: '12px 11px',
                                        backgroundColor: 'white', 
                                        cursor: 'pointer',
                                        textAlign:'left'
                                    }}
                                >
                                    <span 
                                        className="truncate dir-ltr text-xs"
                                        style={{
                                            fontFamily: '"IBM Plex Sans Arabic", sans-serif',
                                            fontWeight: 500,
                                            fontSize: '14px',
                                            lineHeight: '100%',
                                            textAlign: 'right',
                                            color: '#222222',
                                            flex: 1,
                                            marginRight: '10px', 
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            direction:'ltr'
                                        }}
                                    >
                                        https://www.ifjvpmqvxfwt56.....
                                    </span>

                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                </button>

                            </div>

                            <div 
                                className="p-4 mt-1 border-b rounded-[14px] border-[#EAEAEA]"
                                style={{
                                    backgroundColor: '#F6F6F6',
                                    fontFamily: '"IBM Plex Sans Arabic", sans-serif',
                                    fontWeight: 600,
                                    fontSize: '16px',
                                    lineHeight: '100%',
                                    textAlign: 'right',
                                    color: '#000000'
                                }}
                            >
                                للمستخدمين المسجلين عن طريق رابط التسويق
                            </div>

                            <div className="p-4 space-y-4">
                                {[
                                    { name: 'عبدالله محمد', points: 80 },
                                    { name: 'فادي شامي', points: 80 },
                                    { name: 'سوسن احمد', points: 80 },
                                    { name: 'مريم الحسين', points: 70 },
                                    { name: 'مريم الحسين', points: 70 },
                                    { name: 'مريم الحسين', points: 70 },
                                ].map((user, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img src={userIcon} alt="User" className="w-5 h-5 opacity-60" />
                                            <span style={labelStyle}>{user.name}</span>
                                        </div>
                                        <span className="font-bold text-gray-800 text-sm">{user.points}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
      </div>
    </div>
    );
}

export default ProfilePage;
