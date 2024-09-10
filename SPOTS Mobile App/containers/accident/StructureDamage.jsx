import React, { useState, useContext, forwardRef } from 'react';
import { View, Text, TextInput, SafeAreaView, ToastAndroid } from 'react-native';
import WhiteButton from '../../components/common/WhiteButton';
import BackToHomeButton from '../../components/common/BackToHomeButton';
import styles from '../../components/spots-styles';
import AccidentReport from '../../models/AccidentReport';
import DatabaseService from '../../utils/DatabaseService';
import { AccidentReportContext } from '../../context/accidentReportContext';

const StructureDamage = forwardRef((props, ref) => {
    const { accidentReport, updateAccidentReport } = useContext(AccidentReportContext);

    const [structuralDamage, setStructuralDamage] = useState(accidentReport.STRUCTURE_DAMAGES || '');

    // Expose the validate function
    React.useImperativeHandle(ref, () => ({
        validate: save_as_draft,
    }));

    const save_as_draft = async () => {

        const updatedReport = {
            ...accidentReport,
            STRUCTURE_DAMAGES: structuralDamage,
        };

        console.log("start saving StructureDamage " , updatedReport);
        AccidentReport.insert(DatabaseService.db, updatedReport);
        updateAccidentReport(updatedReport);
        ToastAndroid.show("Saved successfully", ToastAndroid.SHORT);
        return true;
    };

    return (
        <View style={styles.ContainerWhiteBG}>
            <SafeAreaView>
                    <View >
                        <View style={styles.ComponentFrame}>
                            <View style={[styles.TextInputContainer, {marginTop: 25}]}>
                                <Text>
                                    <Text style={styles.Label}> Damage to structure/property, if any </Text>
                                    <Text style={styles.LabelThin}> (255 Characters)</Text>
                                </Text>
                                <View style={[styles.TextInputWrapper, {marginTop: 8}]}>
                                    <TextInput
                                        style={styles.RoundedLongTextInputWhiteFont}
                                        multiline
                                        editable
                                        textAlignVertical="top"
                                        onChangeText={(text) => setStructuralDamage(text)}
                                        maxLength={255}
                                        value={structuralDamage}
                                    />
                                    <Text style={styles.CharCounter}>{structuralDamage.length}/255</Text>
                                </View>
                            </View>

                            <View style={styles.TextInputContainer}>
                                <View style={styles.MarginContainer} />
                                <WhiteButton title="SAVE AS DRAFT" customClick={() => save_as_draft()}/>
                                <View style={styles.MarginContainer} />
                                <BackToHomeButton/>
                            </View>
                        </View>
                    </View>
            </SafeAreaView>
        </View>
    );
});

export default StructureDamage;