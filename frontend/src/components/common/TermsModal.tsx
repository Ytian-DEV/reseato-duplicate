import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 shrink-0">
          <h2 id="terms-modal-title" className="text-xl font-display font-semibold text-primary-800">
            RESEATO Terms and Conditions & Policy
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-6 flex-1">
          <p className="text-neutral-600 leading-relaxed mb-6">
            By ticking the agreement box and proceeding with payment, you acknowledge that you have
            read, understood, and agreed to the following Terms and Conditions.
          </p>

          <ol className="list-decimal list-outside space-y-5 text-neutral-700 leading-relaxed pl-5 text-sm md:text-base">
            <li>
              <strong className="text-neutral-900">Acceptance of Terms.</strong> By using RESEATO and
              completing a reservation, you agree to comply with all policies stated herein. If you
              do not agree with these terms, you must not proceed with the reservation or payment.
            </li>
            <li>
              <strong className="text-neutral-900">Payment Policy.</strong> All reservation payments
              made through RESEATO are considered final and non-refundable once successfully
              processed. No cancellations, modifications, or refund requests will be entertained
              after payment confirmation. Customers are advised to carefully review their reservation
              details (date, time, number of guests, and restaurant selection) before completing
              payment.
            </li>
            <li>
              <strong className="text-neutral-900">No Cancellation Policy.</strong> Once payment has
              been successfully processed, the reservation is confirmed and cannot be canceled,
              transferred, or rescheduled.
            </li>
            <li>
              <strong className="text-neutral-900">Limitation of Liability – Payment and Data Security.</strong>{' '}
              RESEATO utilizes third-party payment gateway providers to process online payments.
              While reasonable security measures are implemented, RESEATO shall not be held liable
              for:
              <ul className="list-disc list-inside mt-2 space-y-1 text-neutral-600">
                <li>Any data breach, unauthorized access, or leakage of personal information</li>
                <li>Any exposure or compromise of credit/debit card details</li>
                <li>Any loss arising from third-party system vulnerabilities</li>
              </ul>
              By proceeding with payment, you acknowledge and accept these risks.
            </li>
            <li>
              <strong className="text-neutral-900">Accuracy of Information.</strong> Customers are
              responsible for providing accurate and complete personal and payment information.
              RESEATO shall not be liable for failed reservations due to incorrect details
              submitted by the user.
            </li>
            <li>
              <strong className="text-neutral-900">Restaurant Responsibility.</strong> RESEATO
              acts as a reservation platform only. The partnered restaurant is solely responsible
              for food quality, service delivery, pricing accuracy, and dining experience.
            </li>
            <li>
              <strong className="text-neutral-900">Force Majeure.</strong> RESEATO shall not be held
              liable for failure to fulfill reservations due to events beyond reasonable control,
              including but not limited to natural disasters, government restrictions, system
              outages, or emergencies.
            </li>
            <li>
              <strong className="text-neutral-900">System Availability.</strong> While RESEATO
              strives to maintain continuous system availability, we do not guarantee
              uninterrupted access due to possible maintenance, updates, or technical issues.
            </li>
            <li>
              <strong className="text-neutral-900">Amendments.</strong> RESEATO reserves the right
              to modify these Terms and Conditions at any time. Continued use of the system
              constitutes acceptance of any revisions.
            </li>
            <li>
              <strong className="text-neutral-900">No-Show Policy.</strong> Payment will be
              forfeited if the customer fails to appear at the reserved time.
            </li>
            <li>
              <strong className="text-neutral-900">Chargeback Protection Clause.</strong> Customers
              agree not to initiate fraudulent chargebacks.
            </li>
            <li>
              <strong className="text-neutral-900">Privacy Policy.</strong> Personal data is
              collected, stored, and protected in accordance with our privacy practices. By using
              RESEATO, you consent to such collection and use.
            </li>
            <li>
              <strong className="text-neutral-900">User Conduct Clause.</strong> No fraudulent
              bookings or misuse of the platform is permitted.
            </li>
            <li>
              <strong className="text-neutral-900">Time Allowance Policy.</strong> Reservation
              automatically expires if the customer arrives late (e.g., 15–30 minutes grace
              period).
            </li>
          </ol>
        </div>
        <div className="px-6 py-4 border-t border-neutral-200 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-primary-700 text-white font-medium hover:bg-primary-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
