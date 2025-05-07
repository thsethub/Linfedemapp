import React, { createContext, useState, ReactNode, useContext } from "react";

interface PatientData {
  fullName: string;
  birthDate: string;
  address: string;
  phone: string;
  weight: string;
  height: string;
  activityLevel: string;
  maritalStatus: string;
  occupation: string;
  cancerDiagnosisDate: string;
  procedures: string[];
  skinChanges: string[];
  musculoskeletalComplaints: string;
  lymphedemaSymptoms: string;
  cacifoSign: string;
  orangePeelSign: string;
  stemmerSign: string;
  radiotherapy: { type: string; duration: string };
  surgery: { type: string; duration: string };
  axillaryDissection: { type: string; duration: string };
  musculoskeletalChanges: string;
  lymphedemaSymptomsDetails: string;
  note?: string;
  volumesReferencia?: number[];
  volumesAfetado?: number[];
}

interface MeasurementContextProps {
  pontosRef: "5cm" | "7cm" | "10cm";
  setPontosRef: (value: "5cm" | "7cm" | "10cm") => void;
  selectedValue: string | null;
  setSelectedValue: (value: string | null) => void;
  leftArmInputs: string[];
  setLeftArmInputs: (value: string[]) => void;
  rightArmInputs: string[];
  setRightArmInputs: (value: string[]) => void;
  leftArmComprimento: string;
  setLeftArmComprimento: (value: string) => void;
  rightArmComprimento: string;
  setRightArmComprimento: (value: string) => void;
  differences: number[];
  setDifferences: (value: number[]) => void;
  referenceArm: "right" | "left";
  setReferenceArm: (value: "right" | "left") => void;
  affectedArm: "right" | "left";
  setAffectedArm: (value: "right" | "left") => void;
  patientData: PatientData;
  setPatientData: (data: PatientData) => void;
  clearAllData: () => void;
}

const MeasurementContext = createContext<MeasurementContextProps | undefined>(
  undefined
);

export const MeasurementProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [pontosRef, setPontosRef] = useState<"5cm" | "7cm" | "10cm">("5cm");
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [leftArmInputs, setLeftArmInputs] = useState<string[]>(Array(9).fill(""));
  const [rightArmInputs, setRightArmInputs] = useState<string[]>(Array(9).fill(""));
  const [leftArmComprimento, setLeftArmComprimento] = useState("0");
  const [rightArmComprimento, setRightArmComprimento] = useState("0");
  const [differences, setDifferences] = useState<number[]>([]);
  const [referenceArm, setReferenceArm] = useState<"right" | "left">("left");
  const [affectedArm, setAffectedArm] = useState<"right" | "left">("right");

  // Estado para os dados do paciente
  const [patientData, setPatientData] = useState<PatientData>({
    fullName: "",
    birthDate: "",
    address: "",
    phone: "",
    weight: "",
    height: "",
    activityLevel: "",
    maritalStatus: "",
    occupation: "",
    cancerDiagnosisDate: "",
    procedures: [],
    skinChanges: [],
    musculoskeletalComplaints: "Não",
    lymphedemaSymptoms: "Não",
    cacifoSign: "Não",
    orangePeelSign: "Não",
    stemmerSign: "Não",
    radiotherapy: { type: "", duration: "" },
    surgery: { type: "", duration: "" },
    axillaryDissection: { type: "", duration: "" },
    musculoskeletalChanges: "",
    lymphedemaSymptomsDetails: "",
  });

  const clearAllData = () => {
    // Limpa os dados do paciente
    setPatientData({
      fullName: "",
      birthDate: "",
      address: "",
      phone: "",
      weight: "",
      height: "",
      activityLevel: "",
      maritalStatus: "",
      occupation: "",
      cancerDiagnosisDate: "",
      procedures: [],
      skinChanges: [],
      musculoskeletalComplaints: "Não",
      lymphedemaSymptoms: "Não",
      cacifoSign: "Não",
      orangePeelSign: "Não",
      stemmerSign: "Não",
      radiotherapy: { type: "", duration: "" },
      surgery: { type: "", duration: "" },
      axillaryDissection: { type: "", duration: "" },
      musculoskeletalChanges: "",
      lymphedemaSymptomsDetails: "",
    });
  }

  return (
    <MeasurementContext.Provider
      value={{
        pontosRef,
        setPontosRef,
        selectedValue,
        setSelectedValue,
        leftArmInputs,
        setLeftArmInputs,
        rightArmInputs,
        setRightArmInputs,
        leftArmComprimento,
        setLeftArmComprimento,
        rightArmComprimento,
        setRightArmComprimento,
        differences,
        setDifferences,
        referenceArm,
        setReferenceArm,
        affectedArm,
        setAffectedArm,
        patientData,
        setPatientData,
        clearAllData
      }}
    >
      {children}
    </MeasurementContext.Provider>
  );
};

export const useMeasurementContext = () => {
  const context = useContext(MeasurementContext);
  if (!context) {
    throw new Error(
      "useMeasurementContext must be used within a MeasurementProvider"
    );
  }
  return context;
};