import React from 'react';
import * as MdIcons from 'react-icons/md'; 
import * as Io5Icons from 'react-icons/io5'; 
import * as SiIcons from 'react-icons/si'; 
import * as VscIcons from 'react-icons/vsc'; 
import * as Fa6Icons from 'react-icons/fa'; 
import * as BiIcons from 'react-icons/bi'; 
import * as GrIcons from 'react-icons/gr'; 
import * as TbIcons from 'react-icons/tb'; 
import * as GiIcons from 'react-icons/gi'; 
import * as RiIcons from 'react-icons/ri'; 
import * as LuIcons from 'react-icons/lu';
import * as AIIcons from 'react-icons/ai';
import * as IOIcons from 'react-icons/io';

export const iconRegistry: { [key: string]: React.ReactElement } = {
    // Material Design
    'md/MdOutlineSentimentVeryDissatisfied': <MdIcons.MdOutlineSentimentVeryDissatisfied />,
    'md/MdTextRotationAngleup': <MdIcons.MdTextRotationAngleup />,
    'md/MdOutlineTopic': <MdIcons.MdOutlineTopic />,
    'md/MdImageSearch': <MdIcons.MdImageSearch />,
    'md/MdOutlineImagesearchRoller': <MdIcons.MdOutlineImagesearchRoller />,
    'md/MdObjectGroup': <MdIcons.MdDataObject />,
    'md/MdSpatialAudioOff': <MdIcons.MdSpatialAudioOff />,
    'md/MdNoiseControlOff': <MdIcons.MdNoiseControlOff />,
    'md/MdFaceRetouchingOff': <MdIcons.MdFaceRetouchingOff />,
    'md/MdOutlineLensBlur': <MdIcons.MdOutlineLensBlur />,
    'md/MdOutlineDirtyLens': <MdIcons.MdOutlineDirtyLens />,
    'md/MdOutlineBusinessCenter': <MdIcons.MdOutlineBusinessCenter />,
    'md/MdOutlineSettingsInputSvideo': <MdIcons.MdOutlineSettingsInputSvideo />,
    'md/MdVideoCameraBack': <MdIcons.MdVideoCameraBack />,
    'md/MdOutlineOndemandVideo': <MdIcons.MdOutlineOndemandVideo />,
  
    // Ionicons 5
    'io5/IoDocumentTextSharp': <Io5Icons.IoDocumentTextSharp />,
    'io5/IoDocumentsSharp': <Io5Icons.IoDocumentsSharp />,
    'io5/IoPersonCircleSharp': <Io5Icons.IoPersonCircleSharp />,
    'io5/IoQrCode': <Io5Icons.IoQrCode />,
  
    // Simple Icons
    'si/SiNamecheap': <SiIcons.SiNamecheap />,
    'si/SiKakaotalk': <SiIcons.SiKakaotalk />,
    'si/SiKnowledgebase': <SiIcons.SiKnowledgebase />,
    'si/SiGoogleadmob': <SiIcons.SiGoogleadmob />,
  
    // Visual Studio Code
    'vsc/VscWordWrap': <VscIcons.VscWordWrap />,
    'vsc/VscSymbolKeyword': <VscIcons.VscSymbolKeyword />,
  
    // Font Awesome 6
    'fa6/FaCodeCompare': <Fa6Icons.FaCodeBranch />,
    'fa6/FaRocketchat': <Fa6Icons.FaRocketchat />,
    'fa6/FaRegFileAudio': <Fa6Icons.FaRegFileAudio />,
    'fa6/FaBalanceScaleLeft': <Fa6Icons.FaBalanceScaleLeft />,
    'fa6/FaObjectGroup': <Fa6Icons.FaObjectGroup />,
    'fa6/FaPhotoVideo': <Fa6Icons.FaPhotoVideo />,
  
    // Boxicons
    'bi/BiLogoCreativeCommons': <BiIcons.BiLogoCreativeCommons />,
  
    // Game Icons (GI)
    'gi/GiCrimeSceneTape': <GiIcons.GiCrimeSceneTape />,
  
    // Game Icons (GR)
    'gr/GrCluster': <GrIcons.GrCluster />,
    'gr/GrDocumentVideo': <GrIcons.GrDocumentVideo />,
    'gr/GrDatabase': <GrIcons.GrDatabase />,
  
    // Remix Icons
    'ri/RiEmotion2Line': <RiIcons.RiEmotion2Line />,
  
    // Tabler Icons
    'tb/TbLanguageHiragana': <TbIcons.TbLanguageHiragana />,
  
    // Lucide Icons
    'lu/LuScanFace': <LuIcons.LuScanFace />,
  
    //AIIcons Icons
    'ai/AiTwotoneInteraction': <AIIcons.AiTwotoneInteraction />,

    "io/IoIosImages": <IOIcons.IoIosImages />
};
  
// Fixed type error with cloneElement by adding proper type assertion
export const getIconFromRegistry = (iconLink: string, size: number = 24, color: string = "black"): React.ReactElement | null => {
    const Icon = iconRegistry[iconLink]; 
    if (!Icon) return null;
    // Use type assertion to tell TypeScript that the props are valid for this element
    return React.cloneElement(Icon, { size, color } as React.SVGAttributes<SVGElement>);
};