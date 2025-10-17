/**
 * Disclaimer modal component for Google Analytics consent
 * Mandatory modal that cannot be closed without accepting terms
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ButtonText,
  Text,
  Box,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
  Link,
  Icon
} from '@gluestack-ui/themed';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipText } from '@gluestack-ui/themed';

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
        bg="$white"
        borderRadius={8}
        style={{
          maxWidth: '50vw',
          width: '50%',
          maxHeight: '85vh',
          overflow: 'hidden'
        } as any}
      >
        {/* Header Section */}
        <Box
          flexDirection='row'
          justifyContent='space-between'
          style={{
            paddingTop: 24,
            paddingBottom: 16,
            paddingLeft: 24,
            paddingRight: 24,
            borderBottomWidth: 1,
            borderBottomColor: '#DFE4E9',
            position: 'relative'
          } as any}
        >
          <Text
            fontSize={20}
            fontWeight={600}
            color="#1C2834"
            lineHeight={28}
            letterSpacing={-0.05}
          >
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
                  flexDirection='row'
                  alignItems='center'
                  pt={8}
                  pr={12}
                  pl={12}
                  pb={8}
                  gap={6}
                >
                  <Text
                    fontSize={14}
                    fontWeight='$medium'
                    lineHeight={20}
                    letterSpacing={1.5}
                    color='#828E9A'
                  >
                    EN
                  </Text>
                  <Icon as={ChevronDownIcon} w={20} h={20} color='#828E9A' />
                </Box>
              );
            }}
          >
            <TooltipContent
              bg='#1C2834'
              pt={5}
              pr={8}
              pl={8}
              pb={5}
              borderRadius={4}
              gap={8}
            >
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
          <Box gap={16}>
            {/* Limitation of Liability Section */}
            <Box>
              <Text
                fontSize={16}
                fontWeight="$semibold"
                color="#1C2834"
                lineHeight={24}
                style={{ marginBottom: 12 } as any}
              >
                Limitation of liability
              </Text>
              <Text
                fontSize={14}
                lineHeight={20}
              >
                Although every care has been taken by the Federal Office of Topography swisstopo to ensure the accuracy of the information published, no guarantee can be given with regard to the accurate, reliable, up-to-date or complete nature of this information.<br />
                swisstopo reserves the right to alter or remove the content, in full or in part, without prior notice.<br />
                Liability claims against swisstopo for material or immaterial damage resulting from access to or use or non-use of the published information, from misuse of the connection or from technical faults are excluded.              </Text>
            </Box>

            {/* Data Acquisition Section */}
            <Box>
              <Text
                fontSize={16}
                fontWeight="$semibold"
                color="#1C2834"
                lineHeight={24}
                style={{ marginBottom: 12 } as any}
              >
                Data acquisition
              </Text>
              <Box>
                <Text
                  fontSize={14}
                  lineHeight={20}
                  style={{ marginBottom: 4 } as any}
                >
                  To enable us to optimally tailor our website to your needs, we use the analysis tools Google Analytics and Sentry. Your behaviour on the website is recorded in anonymised form. No personal data is transmitted or stored. If you do not wish to consent to this, you can stop data collection by analysis tools and still use this website without restrictions.
                </Text>
                <Text
                  fontSize={14}
                  lineHeight={20}
                >
                  You can find more information about this on our{' '}
                  <Link
                    href="https://www.swissgeol.ch/datenschutz-en"
                    style={{ color: '#337083', textDecorationLine: 'underline' } as any}
                  >
                    <Text fontSize={14} color="#337083">Legal framework page</Text>
                  </Link>
                  .
                </Text>
              </Box>
            </Box>

            {/* Consent Checkbox */}
            <Box
              flexDirection="row"
              alignItems="center"
              style={{
                paddingTop: 16,
                paddingBottom: 8
              } as any}
            >
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
                    <CheckboxIcon as={CheckIcon} color="$white" />
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
          bg="$white"
          borderTopWidth={1}
          borderTopColor="#DFE4E9"
          style={{
            paddingTop: 16,
            paddingBottom: 24,
            paddingLeft: 24,
            paddingRight: 24
          } as any}
        >
          <Button
            variant="solid"
            bgColor='#337083'
            onPress={handleAccept}
            w={193}
            h={36}
            style={{
              alignSelf: 'flex-start'
            } as any}
          >
            <ButtonText
              m={0}
              p={0}
              fontSize={'0.875em' as any}
              lineHeight={20}
              letterSpacing={0.5}
              fontWeight={'$medium'}
              textAlign='center'
              verticalAlign='middle'
              color='#FFFFFF'
            >
              Accept
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DisclaimerModal;
