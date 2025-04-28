// FeedbackPDFReport.jsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12
  },
  header: {
    marginBottom: 20,
    textAlign: 'center'
  },
  title: {
    fontSize: 24,
    marginBottom: 10
  },
  date: {
    fontSize: 10,
    color: 'grey'
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf"
  },
  tableRow: {
    flexDirection: "row",
    borderBottomColor: "#bfbfbf",
    borderBottomWidth: 1
  },
  tableColHeader: {
    width: "25%",
    borderRightColor: "#bfbfbf",
    borderRightWidth: 1,
    padding: 5,
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold'
  },
  tableCol: {
    width: "25%",
    borderRightColor: "#bfbfbf",
    borderRightWidth: 1,
    padding: 5
  }
});

const FeedbackPDFReport = ({ feedbacks }) => {
  const currentDate = new Date().toLocaleDateString();
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Feedback Report</Text>
          <Text style={styles.date}>Generated on: {currentDate}</Text>
        </View>
        
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text>Name</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Category</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Rating</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Date</Text>
            </View>
          </View>
          
          {feedbacks.map((feedback, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text>{feedback.name}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{feedback.category}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{feedback.rating}/5</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{new Date(feedback.date).toLocaleDateString()}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default FeedbackPDFReport;