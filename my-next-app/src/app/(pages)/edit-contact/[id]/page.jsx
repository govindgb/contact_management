"use client";
import React, { useState, useEffect } from "react";
import { Input, Button, Form, message, Spin } from "antd";
import { useRouter, usePathname } from "next/navigation"; // usePathname to get the current URL
import { fetchAPI } from "@/utils/fetch";
import getParams from "@/utils/urlparams";

const EditContact = () => {
  const [loading, setLoading] = useState(true); // Start loading by default
  const [contact, setContact] = useState(null);
  const router = useRouter();
  const pathname = usePathname(); // Correct way to get pathname in Next.js 13+
  const [id, setId] = useState(null);

  useEffect(() => {
    // Extract ID from the URL path after the component mounts
    const arrayParams = getParams(pathname);
    if (arrayParams.length >= 3) {
      setId(arrayParams[2]);
    }
  }, [pathname]); // Runs when pathname changes

  useEffect(() => {
    // Run fetchContactDetails once the ID is set
    const fetchContactDetails = async () => {
      if (!id) return; // Wait until ID is available
      setLoading(true);
      try {
        const response = await fetchAPI(`/api/contacts/${id}`, "GET");
        setContact(response);
      } catch (error) {
        message.error("Failed to fetch contact details.");
        console.error("Error fetching contact:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContactDetails();
    }
  }, [id]); // Runs when `id` is available

  const handleSave = async (values) => {
    setLoading(true);
    try {
      await fetchAPI(`/api/contacts/${id}`, "PUT", values);
      message.success("Contact updated successfully!");
      router.push("/"); // Redirect to the homepage after saving
    } catch (error) {
      message.error("Failed to update contact.");
      console.error("Error updating contact:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-4xl p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Contact</h2>

        {loading ? (
          <Spin size="large" className="w-full flex justify-center" />
        ) : (
          <Form
            initialValues={contact}
            onFinish={handleSave}
            layout="vertical"
            className="w-full max-w-lg"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter the name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enter the email!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please enter the phone number!" }]}
            >
              <Input />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
};

export default EditContact;
