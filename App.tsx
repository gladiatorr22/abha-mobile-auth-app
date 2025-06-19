import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Checkbox } from "react-native-paper";
import ABHACreationService from "../ABHAApp/services/ABHACreationService";
import authService from "../ABHAApp/services/authService"; // Import authService to fetch token

const App = () => {
  const steps = [
    { id: 1, label: "Consent Collection" },
    { id: 2, label: "Aadhaar Authentication" },
    { id: 3, label: "Communication Details" },
    { id: 4, label: "ABHA Address Creation" },
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileCreated, setProfileCreated] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaMessage, setCaptchaMessage] = useState("");
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [abhaOtpGenerated, setAbhaOtpGenerated] = useState(false);
  const [accessToken, setAccessToken] = useState(""); // To store the access token
  const [xToken, setXToken] = useState(""); // Ensure xToken is defined in state
  const [abhaAddress, setAbhaAddress] = useState(""); // Ensure abhaAddress is defined in state
  

  const verifyCaptcha = () => {
    if (captchaAnswer === "18") {
      setIsCaptchaVerified(true);
      setCaptchaMessage("CAPTCHA verified successfully!");
    } else {
      setIsCaptchaVerified(false);
      setCaptchaMessage("Incorrect CAPTCHA. Please try again.");
    }
  };

  const handleGenerateOtp = async () => {
    if (!aadhaarNumber) {
      console.error("Aadhaar number is required before generating OTP.");
      return;
    }

    // Fetch the access token when the Aadhaar number is entered
    try {
      const token = await authService.getAccessToken();
      setAccessToken(token); // Save the token for future API calls

      // Now that we have the access token, proceed to generate OTP
      const txnId = ""; // You might want to generate this or get it from a backend service
      const response = await ABHACreationService.requestOtp(txnId, aadhaarNumber); // Pass access token
      console.log(response); // Handle the server response here
      setOtpGenerated(true); 
    } catch (error) {
      console.error("Error generating OTP:", error);
    }
  };

  const handleGenerateAbhaOtp = async () => {
    try {
      const txnId = ""; // Generate or get txnId
      const response = await ABHACreationService.requestOtpByMobile(txnId, mobileNumber); // Pass access token
      console.log(response); 
      setAbhaOtpGenerated(true);
    } catch (error) {
      console.error("Error generating ABHA OTP:", error);
    }
  };

  const handleCreateProfile = async () => {
    const profileData = {
      aadhaarNumber,
      username,
      email,
      mobileNumber, 
    };

    try {
      const txnId = ""; 
      const otpValue = otp; 
      const mobile = mobileNumber; 

      // Use the enrollByAadhaar method to create the ABHA profile
      const response = await ABHACreationService.enrollByAadhaar(txnId, otpValue, mobile); // Pass access token
      console.log(response);
      setProfileCreated(true); // After profile is created, set state to true
    } catch (error) {
      console.error("Error creating ABHA profile:", error);
    }
  };

  const handleCreateAbhaAddress = async () => {
    try {
      const txnId = "";
      const response = await ABHACreationService.enrollAbhaAddress(txnId, abhaAddress, xToken);
      console.log(response);
      setProfileCreated(true);
    } catch (error) {
      console.error("Error creating ABHA address:", error);
    }
  };

  const handleGetAbhaCard = async () => {
    try {
      const response = await ABHACreationService.getAbhaCard(xToken);
      console.log(response);
      // Handle ABHA card download logic here
    } catch (error) {
      console.error("Error fetching ABHA card:", error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Enter Aadhaar Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 12-digit Aadhaar Number"
              keyboardType="numeric"
              value={aadhaarNumber}
              onChangeText={setAadhaarNumber}
            />
            <Text style={styles.declaration}>
              I hereby declare that I am voluntarily sharing my Aadhaar number
              and demographic information issued by UIDAI with National Health
              Authority (NHA) for the sole purpose of creating an ABHA number.
            </Text>

            <View style={styles.captchaContainer}>
              <Text style={styles.captchaTitle}>Solve the CAPTCHA</Text>
              <View style={styles.captchaEquation}>
                <Text style={styles.captchaQuestion}>9 ✕ 2 = </Text>
                <TextInput
                  style={styles.captchaInput}
                  placeholder="Answer"
                  keyboardType="numeric"
                  value={captchaAnswer}
                  onChangeText={setCaptchaAnswer}
                />
              </View>
              <TouchableOpacity
                style={[styles.submitButton, { marginTop: 10 }]}
                onPress={verifyCaptcha}
              >
                <Text style={styles.submitButtonText}>Verify CAPTCHA</Text>
              </TouchableOpacity>
              {captchaMessage && (
                <Text
                  style={[styles.captchaMessage, isCaptchaVerified ? styles.captchaSuccess : styles.captchaError]}
                >
                  {captchaMessage}
                </Text>
              )}
            </View>

            <View style={styles.termsContainer}>
              <Checkbox
                status={isChecked ? "checked" : "unchecked"}
                onPress={() => setIsChecked(!isChecked)}
              />
              <Text style={styles.termsText}>I agree to the terms and conditions</Text>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, (!isChecked || !isCaptchaVerified || !aadhaarNumber) && styles.disabledButton]}
              disabled={!isChecked || !isCaptchaVerified || !aadhaarNumber}
              onPress={() => handleGenerateOtp()}
            >
              <Text style={styles.submitButtonText}>Generate OTP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCurrentStep(1)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Aadhaar Authentication</Text>
            <Text>Mobile Number for ABHA</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Mobile Number linked with ABHA"
              keyboardType="numeric"
              value={mobileNumber}
              onChangeText={setMobileNumber}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleGenerateAbhaOtp}
            >
              <Text style={styles.submitButtonText}>Generate OTP for ABHA</Text>
            </TouchableOpacity>

            {abhaOtpGenerated && (
              <View style={styles.captchaContainer}>
                <Text style={styles.sectionTitle}>Enter OTP for ABHA Linking</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter OTP received via SMS"
                  keyboardType="numeric"
                  value={otp}
                  onChangeText={setOtp}
                />
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => setCurrentStep(3)}
                >
                  <Text style={styles.submitButtonText}>Verify OTP</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCurrentStep(1)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        );
      case 3:
        return (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Enter Communication Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Email ID"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleCreateProfile}
            >
              <Text style={styles.submitButtonText}>Create Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCurrentStep(2)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        );
      case 4:
        return (
          <View style={styles.formContainer}>
            {profileCreated ? (
              <View style={styles.profileContainer}>
                <Text style={styles.sectionTitle}>Profile Created</Text>
                <Text>Name: {username}</Text>
                <Text>ABHA Number: {aadhaarNumber}</Text>
                <Text>Email: {email}</Text>
                <Text>Mobile: {mobileNumber}</Text>
                <TouchableOpacity style={styles.downloadButton}>
                  <Text style={styles.downloadButtonText}>Download ABHA Card</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleCreateProfile}
              >
                <Text style={styles.submitButtonText}>Create Profile</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navigationHeader}>
        {steps.map((step) => (
          <View key={step.id} style={styles.stepContainer}>
            <View
              style={[styles.stepCircle, currentStep === step.id ? styles.activeStep : styles.inactiveStep]}
            >
              <Text style={styles.stepIcon}>{step.id}</Text>
            </View>
            <Text style={styles.stepLabel}>{step.label}</Text>
          </View>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderStepContent()}
      </ScrollView>
    </SafeAreaView>
    
  );
};


const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { padding: 20 },
  navigationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#f9f9f9",
    paddingTop: 40,
  },
  stepContainer: { flex: 1, alignItems: "center" },
  stepCircle: { width: 30, height: 30, borderRadius: 15, justifyContent: "center", alignItems: "center" },
  activeStep: { backgroundColor: "rgb(38, 68, 136)" },
  inactiveStep: { backgroundColor: "#ddd" },
  stepIcon: { color: "#fff", fontWeight: "bold" },
  stepLabel: { marginTop: 5, fontSize: 12, textAlign: "center" },
  formContainer: { backgroundColor: "#fff", borderRadius: 10, padding: 20, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: { height: 40, borderColor: "#ddd", borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 15 },
  declaration: { fontSize: 14, color: "#555", marginBottom: 10 },
  termsContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  termsText: { marginLeft: 10, fontSize: 14 },
  submitButton: { backgroundColor: "rgb(38, 68, 136)", padding: 15, borderRadius: 5, alignItems: "center", marginBottom: 10 },
  submitButtonText: { color: "#fff", fontWeight: "bold" },
  backButton: { backgroundColor: "#ddd", padding: 15, borderRadius: 5, alignItems: "center" },
  backButtonText: { color: "#333" },
  disabledButton: { backgroundColor: "#ddd" },
  profileContainer: { alignItems: "center" },
  downloadButton: { backgroundColor: "rgb(38, 68, 136)", padding: 15, borderRadius: 5, alignItems: "center" },
  downloadButtonText: { color: "#fff", fontWeight: "bold" },
  captchaContainer: { marginVertical: 20 },
  captchaTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  captchaEquation: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  captchaQuestion: { fontSize: 16 },
  captchaInput: { borderBottomWidth: 1, borderBottomColor: "#ddd", width: 80, textAlign: "center", fontSize: 16 },
  captchaMessage: { marginTop: 10, fontSize: 14 },
  captchaSuccess: { color: "green" },
  captchaError: { color: "red" },
});

export default App;
