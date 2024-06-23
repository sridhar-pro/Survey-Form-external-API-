import React, { useState, useRef } from "react";
import FadeIn from "./FadeIn";
import TextInput from "./TextInput";
import Button from "./Button";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    surveyTopic: "",
    favoriteProgrammingLanguage: "",
    yearsOfExperience: "",
    exerciseFrequency: "",
    dietPreference: "",
    highestQualification: "",
    fieldOfStudy: "",
    feedback: ""
  });

  const [errors, setErrors] = useState({});
  const [additionalQuestions, setAdditionalQuestions] = useState([]);
  const [summary, setSummary] = useState(null);
  const summaryRef = useRef(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const validate = () => {
    let errors = {};
    if (!formData.fullName) errors.fullName = "Full Name is required";
    if (!formData.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email address is invalid";
    if (!formData.surveyTopic) errors.surveyTopic = "Survey Topic is required";
    if (formData.surveyTopic === "Technology") {
      if (!formData.favoriteProgrammingLanguage) errors.favoriteProgrammingLanguage = "Favorite Programming Language is required";
      if (!formData.yearsOfExperience || formData.yearsOfExperience <= 0) errors.yearsOfExperience = "Years of Experience must be greater than 0";
    }
    if (formData.surveyTopic === "Health") {
      if (!formData.exerciseFrequency) errors.exerciseFrequency = "Exercise Frequency is required";
      if (!formData.dietPreference) errors.dietPreference = "Diet Preference is required";
    }
    if (formData.surveyTopic === "Education") {
      if (!formData.highestQualification) errors.highestQualification = "Highest Qualification is required";
      if (!formData.fieldOfStudy) errors.fieldOfStudy = "Field of Study is required";
    }
    if (!formData.feedback) errors.feedback = "Feedback is required";
    else if (formData.feedback.length < 50) errors.feedback = "Feedback must be at least 50 characters";
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setSummary(formData);
      window.scrollTo({ top: 0, behavior: "smooth" });

      try {
        let response;
        if (formData.surveyTopic === "Technology") {
          response = await fetch("https://run.mocky.io/v3/660f7b6c-3913-4819-9ee7-c9b0f2169bd2");
        } else if (formData.surveyTopic === "Health") {
          response = await fetch("https://run.mocky.io/v3/efb23435-725c-4c23-b567-cc33cf2d07cb");
        } else if (formData.surveyTopic === "Education") {
          response = await fetch("https://run.mocky.io/v3/a2dac273-f496-4593-a7ad-f51dbc851abd");
        }
        const data = await response.json();
        setAdditionalQuestions(data.questions);
      } catch (error) {
        console.error("Error fetching additional questions:", error);
      }
    }
  };

  return (
    <FadeIn>
      {summary && (
        <div ref={summaryRef} className="mb-8 p-6 border rounded-md bg-white shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Form Summary</h2>
          <p><strong>Full Name:</strong> {summary.fullName}</p>
          <p><strong>Email:</strong> {summary.email}</p>
          <p><strong>Survey Topic:</strong> {summary.surveyTopic}</p>
          {summary.surveyTopic === "Technology" && (
            <>
              <p><strong>Favorite Programming Language:</strong> {summary.favoriteProgrammingLanguage}</p>
              <p><strong>Years of Experience:</strong> {summary.yearsOfExperience}</p>
            </>
          )}
          {summary.surveyTopic === "Health" && (
            <>
              <p><strong>Exercise Frequency:</strong> {summary.exerciseFrequency}</p>
              <p><strong>Diet Preference:</strong> {summary.dietPreference}</p>
            </>
          )}
          {summary.surveyTopic === "Education" && (
            <>
              <p><strong>Highest Qualification:</strong> {summary.highestQualification}</p>
              <p><strong>Field of Study:</strong> {summary.fieldOfStudy}</p>
            </>
          )}
          <p><strong>Feedback:</strong> {summary.feedback}</p>
          {additionalQuestions.length > 0 && (
            <>
              <h3 className="text-xl font-bold mt-4">Additional Questions</h3>
              {additionalQuestions.map((question, index) => (
                <p key={index}><strong>{question.question}:</strong> {question.answer}</p>
              ))}
            </>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="isolate mt-2 -space-y-px rounded-2xl bg-white/50">
          <TextInput
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            error={errors.fullName}
          />
          <TextInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
          />
          <div className="border border-neutral-300 px-6 py-8 first:rounded-t-2xl last:rounded-b-2xl">
            <label className="text-base/6 text-neutral-500">Survey Topic</label>
            <select
              name="surveyTopic"
              value={formData.surveyTopic}
              onChange={handleInputChange}
              className="mt-2 block w-full px-4 py-2 border border-neutral-300 rounded-md"
            >
              <option value="">Select a topic</option>
              <option value="Technology">Technology</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
            </select>
          </div>
          {formData.surveyTopic === "Technology" && (
            <>
              <div className="border border-neutral-300 px-2 py-4 first:rounded-t-2xl last:rounded-b-2xl">
                <label className="text-base/6 text-neutral-500">Favorite Programming Language</label>
                <select
                  name="favoriteProgrammingLanguage"
                  value={formData.favoriteProgrammingLanguage}
                  onChange={handleInputChange}
                  className="mt-2 block w-full px-4 py-2 border border-neutral-300 rounded-md"
                >
                  <option value="">Select a language</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                </select>
                {errors.favoriteProgrammingLanguage && <p className="text-red-500 text-sm">{errors.favoriteProgrammingLanguage}</p>}
              </div>
              <div className="border border-neutral-300 px-2 py-4 first:rounded-t-2xl last:rounded-b-2xl">
                <TextInput
                  label="Years of Experience"
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  error={errors.yearsOfExperience}
                />
              </div>
            </>
          )}
          {formData.surveyTopic === "Health" && (
            <>
              <div className="border border-neutral-300 px-2 py-4 first:rounded-t-2xl last:rounded-b-2xl">
                <label className="text-base/6 text-neutral-500">Exercise Frequency</label>
                <select
                  name="exerciseFrequency"
                  value={formData.exerciseFrequency}
                  onChange={handleInputChange}
                  className="mt-2 block w-full px-4 py-2 border border-neutral-300 rounded-md"
                >
                  <option value="">Select a frequency</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Rarely">Rarely</option>
                </select>
                {errors.exerciseFrequency && <p className="text-red-500 text-sm">{errors.exerciseFrequency}</p>}
              </div>
              <div className="border border-neutral-300 px-2 py-4 first:rounded-t-2xl last:rounded-b-2xl">
                <label className="text-base/6 text-neutral-500">Diet Preference</label>
                <select
                  name="dietPreference"
                  value={formData.dietPreference}
                  onChange={handleInputChange}
                  className="mt-2 block w-full px-4 py-2 border border-neutral-300 rounded-md"
                >
                  <option value="">Select a preference</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                </select>
                {errors.dietPreference && <p className="text-red-500 text-sm">{errors.dietPreference}</p>}
              </div>
            </>
          )}
          {formData.surveyTopic === "Education" && (
            <>
              <div className="border border-neutral-300 px-2 py-4 first:rounded-t-2xl last:rounded-b-2xl">
                <label className="text-base/6 text-neutral-500">Highest Qualification</label>
                <select
                  name="highestQualification"
                  value={formData.highestQualification}
                  onChange={handleInputChange}
                  className="mt-2 block w-full px-4 py-2 border border-neutral-300 rounded-md"
                >
                  <option value="">Select a qualification</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor's">Bachelor's</option>
                  <option value="Master's">Master's</option>
                  <option value="PhD">PhD</option>
                </select>
                {errors.highestQualification && <p className="text-red-500 text-sm">{errors.highestQualification}</p>}
              </div>
              <div className="border border-neutral-300 px-2 py-4 first:rounded-t-2xl last:rounded-b-2xl">
                <TextInput
                  label="Field of Study"
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={handleInputChange}
                  error={errors.fieldOfStudy}
                />
              </div>
            </>
          )}
          <div className="border border-neutral-300 px-2 py-4 first:rounded-t-2xl last:rounded-b-2xl">
            <TextInput
              label="Feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleInputChange}
              error={errors.feedback}
              textarea
            />
          </div>
        </div>
        <div className="flex justify-center">
          <Button type="submit" className="mt-2">
            SUBMIT NOW
          </Button>
        </div>
      </form>
    </FadeIn>
  );
};

export default ContactForm;
