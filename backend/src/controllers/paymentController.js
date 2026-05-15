import paymentService from '../services/paymentService.js';
import Reservation from '../models/reservation.js';

const extractPaymentUrl = (transaction) => {
  return transaction?.payment_method?.extra?.async_payment_url
    || transaction?.payment_method?.extra?.pseURL
    || null;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const resolvePaymentUrl = async (transaction) => {
  let paymentUrl = extractPaymentUrl(transaction);
  let finalTransaction = transaction;

  if (!paymentUrl && transaction?.id) {
    const firstFetch = await paymentService.getTransactionById(transaction.id);
    finalTransaction = firstFetch || transaction;
    paymentUrl = extractPaymentUrl(firstFetch) || firstFetch?.redirect_url || null;

    if (!paymentUrl) {
      await sleep(800);
      const secondFetch = await paymentService.getTransactionById(transaction.id);
      finalTransaction = secondFetch || finalTransaction;
      paymentUrl = extractPaymentUrl(secondFetch) || secondFetch?.redirect_url || paymentUrl;
    }
  }

  return { paymentUrl, finalTransaction };
};

const createPSEPayment = async (req, res) => {
  try {
    const { amount, currency, customerEmail, reference, userType, userLegalId, userLegalIdType, financialInstitutionCode, phone_number, full_name } = req.body;

    const transaction = await paymentService.createPSETransaction(
      amount,
      currency,
      customerEmail,
      reference,
      userType,
      userLegalId,
      userLegalIdType,
      financialInstitutionCode,
      { phone_number, full_name }
    );

    res.status(200).json({
      success: true,
      transactionId: transaction.id,
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creando pago PSE',
      error: error.message,
    });
  }
};

const createBancolombiaPayment = async (req, res) => {
  try {
    const { amount, currency, customerEmail, reference, userType, userLegalId, userLegalIdType, phone_number, full_name } = req.body;

    const transaction = await paymentService.createBancolombiaTransaction(
      amount,
      currency,
      customerEmail,
      reference,
      userType,
      userLegalId,
      userLegalIdType,
      { phone_number, full_name }
    );

    res.status(200).json({
      success: true,
      transactionId: transaction.id,
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creando pago Bancolombia',
      error: error.message,
    });
  }
};

const handleWebhook = async (req, res) => {
  try {
    const event = req.body;

    if (event.event === 'transaction.updated') {
      const transaction = event.data.transaction;

      // Buscar la reserva por payment_id (reference)
      const reservation = await Reservation.findOne({ where: { payment_id: transaction.reference } });

      if (reservation) {
        if (transaction.status === 'APPROVED') {
          reservation.payment_status = 'approved';
          reservation.estado = 'Activa'; // o Completada si es el caso
        } else if (transaction.status === 'DECLINED') {
          reservation.payment_status = 'declined';
          reservation.estado = 'Cancelada';
        } else if (transaction.status === 'ERROR') {
          reservation.payment_status = 'error';
        }

        await reservation.save();
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error en webhook:', error);
    res.status(500).json({ error: 'Webhook error' });
  }
};

const getTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await paymentService.getTransactionById(id);
    const paymentUrl = extractPaymentUrl(transaction);

    res.status(200).json({
      success: true,
      transaction,
      paymentUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error consultando transacción',
      error: error.message,
    });
  }
};

export { createPSEPayment, createBancolombiaPayment, handleWebhook, getTransactionStatus };