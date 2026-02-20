import React, { useState, useEffect, useRef } from 'react';
import { STRIPE_PUBLIC_KEY } from '../utils/constants';

function StripePayment({ amount, planName, onPaymentMethodCreated, onCancel }) {
  const [stripe, setStripe] = useState(null);
  const [cardElement, setCardElement] = useState(null);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const cardMountRef = useRef(false);

  useEffect(() => {
    // Initialize Stripe
    if (window.Stripe && !stripe) {
      const stripeInstance = window.Stripe(STRIPE_PUBLIC_KEY);
      setStripe(stripeInstance);

      const elements = stripeInstance.elements();
      const card = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#32325d',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
          },
        },
      });
      
      setCardElement(card);
    }
  }, [stripe]);

  useEffect(() => {
    // Mount card element
    if (cardElement && !cardMountRef.current) {
      cardElement.mount('#card-element');
      cardMountRef.current = true;

      cardElement.on('change', (event) => {
        if (event.error) {
          setError(event.error.message);
        } else {
          setError('');
        }
      });
    }
  }, [cardElement]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !cardElement) {
      setError('Stripe لم يتم تحميل');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // Create payment method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (pmError) {
        throw new Error(pmError.message);
      }

      // Pass payment method to parent component
      onPaymentMethodCreated(paymentMethod.id);
    } catch (err) {
      setError(err.message || 'فشل إنشاء طريقة الدفع');
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          إتمام عملية الدفع
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Plan Summary */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm mb-1">الخطة المختارة</span>
            <span className="font-bold text-xl text-gray-800">{planName}</span>
          </div>
          <div className="flex flex-col md:items-end">
            <span className="text-gray-500 text-sm mb-1">المبلغ الإجمالي</span>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-4xl text-[#4F67BD]">${amount}</span>
              <span className="text-gray-500 text-lg">دولار</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-3 text-lg">
            معلومات البطاقة
          </label>
          <div 
            id="card-element" 
            className="border-2 border-gray-200 rounded-xl p-5 focus-within:border-[#4F67BD] focus-within:shadow-lg transition-all bg-white"
          />
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Test Card Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-base text-blue-900 font-bold mb-3">
                💳 بطاقة اختبار (Stripe Test Mode)
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-800 font-medium">رقم البطاقة:</span>
                  <code className="bg-blue-100 px-3 py-1.5 rounded-lg text-blue-900 font-mono text-sm">4242 4242 4242 4242</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-800 font-medium">تاريخ الانتهاء:</span>
                  <code className="bg-blue-100 px-3 py-1.5 rounded-lg text-blue-900 font-mono text-sm">12/25</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-800 font-medium">CVV:</span>
                  <code className="bg-blue-100 px-3 py-1.5 rounded-lg text-blue-900 font-mono text-sm">123</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={processing || !stripe}
            className="flex-1 bg-gradient-to-r from-[#4F67BD] to-[#3e539a] text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>جاري المعالجة...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                <span>ادفع الآن ${amount}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="sm:w-auto px-8 bg-gray-100 text-gray-700 font-bold py-4 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 text-lg"
          >
            إلغاء
          </button>
        </div>
      </form>

      {/* Security Badge */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-3 text-base text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">دفع آمن ومشفر بواسطة Stripe</span>
        </div>
      </div>
    </div>
  );
}

export default StripePayment;

