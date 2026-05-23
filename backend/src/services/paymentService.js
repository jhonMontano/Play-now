import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const WOMPI_BASE_URL = 'https://api.wompi.co/v1';
const WOMPI_PUBLIC_KEY = process.env.WOMPI_PUBLIC_KEY;
const WOMPI_PRIVATE_KEY = process.env.WOMPI_PRIVATE_KEY;
const WOMPI_INTEGRITY_SECRET = process.env.WOMPI_INTEGRITY_SECRET;

class PaymentService {

  generateSignature(
    reference,
    amountInCents,
    currency
  ) {

    const integritySecret = WOMPI_INTEGRITY_SECRET || WOMPI_PRIVATE_KEY;

    const signatureString = `${reference}${amountInCents}${currency}${integritySecret}`;

    return crypto
      .createHash('sha256')
      .update(signatureString)
      .digest('hex');
  }

  mapUserType(userType) {

    if (
      userType === 1 ||
      String(userType).toUpperCase() === 'COMPANY'
    ) {
      return 'COMPANY';
    }

    return 'PERSON';
  }

  mapPseUserType(userType) {

    if (
      userType === 1 ||
      String(userType).toUpperCase() === 'COMPANY'
    ) {
      return 1;
    }

    return 0;
  }

  async getAcceptanceToken() {

    try {

      const response =
        await axios.get(
          `${WOMPI_BASE_URL}/merchants/${WOMPI_PUBLIC_KEY}`
        );

      return response
        .data
        .data
        .presigned_acceptance
        .acceptance_token;

    } catch (error) {

      if (error.response) {

        console.error(
          'Error obteniendo token:',
          error.response.data
        );

        throw new Error(
          error.response.data.error?.message ||
          JSON.stringify(error.response.data)
        );
      }

      throw error;
    }
  }

  async createTransaction(
    amount,
    currency,
    customerEmail,
    paymentMethod,
    reference,
    customerData = {}
  ) {

    try {

      const acceptanceToken =
        await this.getAcceptanceToken();

      const amountInCents =
        amount * 100;

      const signature =
        this.generateSignature(
          reference,
          amountInCents,
          currency
        );

      const transactionData = {

        amount_in_cents:
          amountInCents,

        currency,

        customer_email:
          customerEmail,

        reference,

        acceptance_token:
          acceptanceToken,

        payment_method:
          paymentMethod,

        signature,

        redirect_url:
          'https://play-now-xm2c.onrender.com/client/payment-result',

        customer_data: {

          phone_number:
            customerData.phone_number ||
            '3045491946',

          full_name:
            customerData.full_name ||
            'Cliente PlayNow',
        },
      };

      console.log(
        'BODY ENVIADO A WOMPI:',
        JSON.stringify(transactionData, null, 2)
      );

      const response =
        await axios.post(
          `${WOMPI_BASE_URL}/transactions`,
          transactionData,
          {
            headers: {
              Authorization:
                `Bearer ${WOMPI_PRIVATE_KEY}`,
            },
          }
        );

      console.log(
        'RESPUESTA CREAR TRANSACCION:',
        JSON.stringify(response.data, null, 2)
      );

      return response.data.data;

    } catch (error) {

      if (error.response) {

        console.error(
          'Error creando transacción:',
          error.response.status,
          error.response.data
        );

        throw new Error(
          error.response.data.error?.message ||
          JSON.stringify(error.response.data)
        );
      }

      console.error(
        'Error creando transacción:',
        error.message
      );

      throw error;
    }
  }

  async getTransactionById(
    transactionId
  ) {

    try {

      const response =
        await axios.get(
          `${WOMPI_BASE_URL}/transactions/${transactionId}`,
          {
            headers: {
              Authorization:
                `Bearer ${WOMPI_PRIVATE_KEY}`,
            },
          }
        );

      console.log(
        'DETALLE TRANSACCION:',
        JSON.stringify(response.data, null, 2)
      );

      return response.data.data;

    } catch (error) {

      if (error.response) {

        console.error(
          'Error consultando transacción:',
          error.response.status,
          error.response.data
        );

        throw new Error(
          error.response.data.error?.message ||
          JSON.stringify(error.response.data)
        );
      }

      console.error(
        'Error consultando transacción:',
        error.message
      );

      throw error;
    }
  }

  async createPSETransaction(
    amount,
    currency,
    customerEmail,
    reference,
    userType,
    userLegalId,
    userLegalIdType,
    financialInstitutionCode,
    customerData = {}
  ) {

    const paymentMethod = {

      type: 'PSE',

      user_type:
        this.mapPseUserType(userType),

      user_legal_id:
        userLegalId,

      user_legal_id_type:
        userLegalIdType,

      financial_institution_code:
        financialInstitutionCode,

      payment_description:
        'Reserva de cancha PlayNow',
    };

    return this.createTransaction(
      amount,
      currency,
      customerEmail,
      paymentMethod,
      reference,
      customerData
    );
  }

  async createBancolombiaTransaction(
    amount,
    currency,
    customerEmail,
    reference,
    userType,
    userLegalId,
    userLegalIdType,
    customerData = {}
  ) {

    const paymentMethod = {

      type:
        'BANCOLOMBIA_TRANSFER',

      user_type:
        this.mapUserType(userType),

      user_legal_id:
        userLegalId,

      user_legal_id_type:
        userLegalIdType,

      payment_description:
        'Reserva de cancha PlayNow',
    };

    return this.createTransaction(
      amount,
      currency,
      customerEmail,
      paymentMethod,
      reference,
      customerData
    );
  }
}

export default new PaymentService();