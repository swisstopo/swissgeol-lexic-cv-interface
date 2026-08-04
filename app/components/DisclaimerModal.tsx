/**
 * Disclaimer modal component for Google Analytics consent
 * Mandatory modal that cannot be closed without accepting terms
 */

'use client';;
import { Tooltip, TooltipContent, TooltipText } from "@/components/ui/tooltip";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";
import { Checkbox, CheckboxIndicator, CheckboxIcon, CheckboxLabel } from "@/components/ui/checkbox";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";

import React, { useState, useEffect } from 'react';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onAccept: (hasConsent: boolean) => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onAccept }) => {
  const [consentChecked, setConsentChecked] = useState(true);

  const handleAccept = () => {
    onAccept(consentChecked);
  };

  const handleConsentChange = (checked: boolean) => {
    setConsentChecked(checked);
  };

  // Lock document scroll while the modal is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!isOpen) return;

    const html = document.documentElement;
    const body = document.body;

    html.classList.add('no-scroll');
    body.classList.add('no-scroll');

    return () => {
      html.classList.remove('no-scroll');
      body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        // Modal cannot be closed without accepting
      }}
      avoidKeyboard
      size="md"
    >
      <ModalBackdrop
        // Ensure full-viewport backdrop coverage
        style={{ position: 'fixed', inset: 0 } as any}
      />
      <ModalContent
        style={{
          maxWidth: '50vw',
          width: '50%',
          maxHeight: '85vh',
          overflow: 'hidden'
        } as any}
        className="bg-white rounded-[8px]">
        {/* Header Section */}
        <Box
          style={{
            paddingTop: 24,
            paddingBottom: 16,
            paddingLeft: 24,
            paddingRight: 24,
            borderBottomWidth: 1,
            borderBottomColor: '#DFE4E9',
            position: 'relative'
          } as any}
          className="flex-row justify-between">
          <Text
            className="text-[20px] font-[600] text-[#1C2834] leading-[28px] -tracking-0.05">
            Terms of service
          </Text>

          {/* Language dropdown with tooltip */}
          <Tooltip
            placement="bottom"
            trigger={(props) => {
              return (
                <Box
                  {...props}
                  style={{ height: 36, cursor: 'pointer' } as any}
                  className="flex-row items-center pt-[8px] pr-[12px] pl-[12px] pb-[8px] gap-[6px]">
                  <Text
                    className="text-[14px] font-medium leading-[20px] tracking-[1.5px] text-[#828E9A]">
                    EN
                  </Text>
                  <Icon as={ChevronDownIcon} className="w-[20px] h-[20px] text-[#828E9A]" />
                </Box>
              );
            }}
          >
            <TooltipContent
              className="bg-[#1C2834] pt-[5px] pr-[8px] pl-[8px] pb-[5px] rounded-[4px] gap-[8px]">
              <TooltipText>Coming soon...</TooltipText>
            </TooltipContent>
          </Tooltip>
        </Box>

        {/* Main Content Section */}
        <ModalBody
          style={{
            paddingTop: 24,
            paddingBottom: 24,
            paddingLeft: 24,
            paddingRight: 24,
            maxHeight: 400,
            overflow: 'auto'
          } as any}
        >
          <Box className="gap-[16px]">
            {/* Limitation of Liability Section */}
            <Box>
              <Text
                style={{ marginBottom: 12 } as any}
                className="text-[16px] font-semibold text-[#1C2834] leading-[24px]">
                Limitation of liability
              </Text>
              <Text className="text-[14px] leading-[20px]">
                Although every care has been taken by the Federal Office of Topography swisstopo to ensure the accuracy of the information published, no guarantee can be given with regard to the accurate, reliable, up-to-date or complete nature of this information.<br />
                swisstopo reserves the right to alter or remove the content, in full or in part, without prior notice.<br />
                Liability claims against swisstopo for material or immaterial damage resulting from access to or use or non-use of the published information, from misuse of the connection or from technical faults are excluded.              </Text>
            </Box>

            {/* Data Acquisition Section */}
            <Box>
              <Text
                style={{ marginBottom: 12 } as any}
                className="text-[16px] font-semibold text-[#1C2834] leading-[24px]">
                Data acquisition
              </Text>
              <Box>
                <Text style={{ marginBottom: 4 } as any} className="text-[14px] leading-[20px]">
                  To enable us to optimally tailor our website to your needs, we use the analysis tools Google Analytics and Sentry. Your behaviour on the website is recorded in anonymised form. No personal data is transmitted or stored. If you do not wish to consent to this, you can stop data collection by analysis tools and still use this website without restrictions.
                </Text>
                <Text className="text-[14px] leading-[20px]">
                  You can find more information about this on our{' '}
                  <Link
                    href="https://www.swissgeol.ch/datenschutz-en"
                    style={{ color: '#337083', textDecorationLine: 'underline' } as any}
                  >
                    <Text className="text-[14px] text-[#337083]">Legal framework page</Text>
                  </Link>
                  .
                </Text>
              </Box>
            </Box>

            {/* Consent Checkbox */}
            <Box
              style={{
                paddingTop: 16,
                paddingBottom: 8
              } as any}
              className="flex-row items-center">
              <Checkbox
                value=""
                isChecked={consentChecked}
                onChange={handleConsentChange}
                style={{
                  marginRight: 8
                } as any}
              >
                <CheckboxIndicator
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    borderWidth: 2,
                    borderColor: consentChecked ? '#337083' : '#ACB4BD',
                    backgroundColor: consentChecked ? '#337083' : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center'
                  } as any}
                >
                  {consentChecked && (
                    <CheckboxIcon as={CheckIcon} className="text-white" />
                  )}
                </CheckboxIndicator>
                <CheckboxLabel
                  style={{
                    fontSize: 14,
                    color: '#337083',
                    lineHeight: 20,
                    marginLeft: 8
                  } as any}
                >
                  Consent to data acquisition (optional)
                </CheckboxLabel>
              </Checkbox>
            </Box>
          </Box>
        </ModalBody>

        {/* Footer Section */}
        <ModalFooter
          style={{
            paddingTop: 16,
            paddingBottom: 24,
            paddingLeft: 24,
            paddingRight: 24
          } as any}
          className="bg-white border-t-[1px] border-t-[#DFE4E9]">
          <Button
            variant="solid"
            onPress={handleAccept}
            style={{
              alignSelf: 'flex-start'
            } as any}
            className="bg-[#337083] w-[193px] h-[36px]">
            <ButtonText
              className="m-[0px] p-[0px] text-[0.875em] leading-[20px] tracking-[0.5px] font-medium text-center align-middle text-[#FFFFFF]">
              Accept
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DisclaimerModal;
