namespace SPOTS_MQ_Integrator
{
    partial class MqDashboard
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MqDashboard));
            this.buttonStartMQController = new System.Windows.Forms.Button();
            this.textBoxAuditDisplay = new System.Windows.Forms.TextBox();
            this.buttonSend = new System.Windows.Forms.Button();
            this.textBoxSendMessage = new System.Windows.Forms.TextBox();
            this.textBoxChannelMessageEvent = new System.Windows.Forms.TextBox();
            this.buttonStopMQController = new System.Windows.Forms.Button();
            this.groupBoxMQController = new System.Windows.Forms.GroupBox();
            this.groupBoxMQSendTest = new System.Windows.Forms.GroupBox();
            this.groupBoxChannelMessages = new System.Windows.Forms.GroupBox();
            this.labelBuildNumber = new System.Windows.Forms.Label();
            this.notifyIconSPOTSMQ = new System.Windows.Forms.NotifyIcon(this.components);
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.labelDeSerializerDisplay = new System.Windows.Forms.Label();
            this.textBoxInputXML = new System.Windows.Forms.TextBox();
            this.buttonDeserialize = new System.Windows.Forms.Button();
            this.checkBoxEnableDeSerializerTest = new System.Windows.Forms.CheckBox();
            this.labelMQConfig = new System.Windows.Forms.Label();
            this.groupBoxMQController.SuspendLayout();
            this.groupBoxMQSendTest.SuspendLayout();
            this.groupBoxChannelMessages.SuspendLayout();
            this.groupBox1.SuspendLayout();
            this.SuspendLayout();
            // 
            // buttonStartMQController
            // 
            this.buttonStartMQController.Location = new System.Drawing.Point(5, 135);
            this.buttonStartMQController.Margin = new System.Windows.Forms.Padding(2, 3, 2, 3);
            this.buttonStartMQController.Name = "buttonStartMQController";
            this.buttonStartMQController.Size = new System.Drawing.Size(249, 62);
            this.buttonStartMQController.TabIndex = 0;
            this.buttonStartMQController.Text = "Connect to MQ";
            this.buttonStartMQController.UseVisualStyleBackColor = true;
            this.buttonStartMQController.Click += new System.EventHandler(this.buttonStartMQController_Click);
            // 
            // textBoxAuditDisplay
            // 
            this.textBoxAuditDisplay.BackColor = System.Drawing.SystemColors.HighlightText;
            this.textBoxAuditDisplay.Location = new System.Drawing.Point(5, 19);
            this.textBoxAuditDisplay.Margin = new System.Windows.Forms.Padding(2, 3, 2, 3);
            this.textBoxAuditDisplay.Multiline = true;
            this.textBoxAuditDisplay.Name = "textBoxAuditDisplay";
            this.textBoxAuditDisplay.ReadOnly = true;
            this.textBoxAuditDisplay.Size = new System.Drawing.Size(498, 110);
            this.textBoxAuditDisplay.TabIndex = 1;
            // 
            // buttonSend
            // 
            this.buttonSend.Enabled = false;
            this.buttonSend.Location = new System.Drawing.Point(6, 217);
            this.buttonSend.Margin = new System.Windows.Forms.Padding(2, 3, 2, 3);
            this.buttonSend.Name = "buttonSend";
            this.buttonSend.Size = new System.Drawing.Size(204, 62);
            this.buttonSend.TabIndex = 2;
            this.buttonSend.Text = "Send";
            this.buttonSend.UseVisualStyleBackColor = true;
            this.buttonSend.Click += new System.EventHandler(this.buttonSend_Click);
            // 
            // textBoxSendMessage
            // 
            this.textBoxSendMessage.Enabled = false;
            this.textBoxSendMessage.Location = new System.Drawing.Point(6, 22);
            this.textBoxSendMessage.Margin = new System.Windows.Forms.Padding(2, 3, 2, 3);
            this.textBoxSendMessage.Multiline = true;
            this.textBoxSendMessage.Name = "textBoxSendMessage";
            this.textBoxSendMessage.Size = new System.Drawing.Size(204, 189);
            this.textBoxSendMessage.TabIndex = 3;
            this.textBoxSendMessage.Text = "Test Message from MQ DashBoard";
            // 
            // textBoxChannelMessageEvent
            // 
            this.textBoxChannelMessageEvent.BackColor = System.Drawing.SystemColors.HighlightText;
            this.textBoxChannelMessageEvent.Location = new System.Drawing.Point(6, 22);
            this.textBoxChannelMessageEvent.Margin = new System.Windows.Forms.Padding(2, 3, 2, 3);
            this.textBoxChannelMessageEvent.Multiline = true;
            this.textBoxChannelMessageEvent.Name = "textBoxChannelMessageEvent";
            this.textBoxChannelMessageEvent.ReadOnly = true;
            this.textBoxChannelMessageEvent.Size = new System.Drawing.Size(272, 257);
            this.textBoxChannelMessageEvent.TabIndex = 4;
            // 
            // buttonStopMQController
            // 
            this.buttonStopMQController.Enabled = false;
            this.buttonStopMQController.Location = new System.Drawing.Point(258, 135);
            this.buttonStopMQController.Margin = new System.Windows.Forms.Padding(2, 3, 2, 3);
            this.buttonStopMQController.Name = "buttonStopMQController";
            this.buttonStopMQController.Size = new System.Drawing.Size(245, 62);
            this.buttonStopMQController.TabIndex = 6;
            this.buttonStopMQController.Text = "Stop MQ Connection";
            this.buttonStopMQController.UseVisualStyleBackColor = true;
            this.buttonStopMQController.Click += new System.EventHandler(this.buttonStopMQController_Click);
            // 
            // groupBoxMQController
            // 
            this.groupBoxMQController.BackColor = System.Drawing.SystemColors.Control;
            this.groupBoxMQController.Controls.Add(this.textBoxAuditDisplay);
            this.groupBoxMQController.Controls.Add(this.buttonStopMQController);
            this.groupBoxMQController.Controls.Add(this.buttonStartMQController);
            this.groupBoxMQController.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.groupBoxMQController.Location = new System.Drawing.Point(12, 12);
            this.groupBoxMQController.Margin = new System.Windows.Forms.Padding(2, 3, 2, 3);
            this.groupBoxMQController.Name = "groupBoxMQController";
            this.groupBoxMQController.Padding = new System.Windows.Forms.Padding(2, 3, 2, 3);
            this.groupBoxMQController.Size = new System.Drawing.Size(507, 211);
            this.groupBoxMQController.TabIndex = 7;
            this.groupBoxMQController.TabStop = false;
            this.groupBoxMQController.Text = "MQ Controller";
            // 
            // groupBoxMQSendTest
            // 
            this.groupBoxMQSendTest.Controls.Add(this.textBoxSendMessage);
            this.groupBoxMQSendTest.Controls.Add(this.buttonSend);
            this.groupBoxMQSendTest.Location = new System.Drawing.Point(11, 229);
            this.groupBoxMQSendTest.Margin = new System.Windows.Forms.Padding(2, 3, 2, 3);
            this.groupBoxMQSendTest.Name = "groupBoxMQSendTest";
            this.groupBoxMQSendTest.Padding = new System.Windows.Forms.Padding(2, 3, 2, 3);
            this.groupBoxMQSendTest.Size = new System.Drawing.Size(222, 285);
            this.groupBoxMQSendTest.TabIndex = 8;
            this.groupBoxMQSendTest.TabStop = false;
            this.groupBoxMQSendTest.Text = "MQ Send Test";
            // 
            // groupBoxChannelMessages
            // 
            this.groupBoxChannelMessages.Controls.Add(this.textBoxChannelMessageEvent);
            this.groupBoxChannelMessages.Location = new System.Drawing.Point(237, 229);
            this.groupBoxChannelMessages.Margin = new System.Windows.Forms.Padding(2, 3, 2, 3);
            this.groupBoxChannelMessages.Name = "groupBoxChannelMessages";
            this.groupBoxChannelMessages.Padding = new System.Windows.Forms.Padding(2, 3, 2, 3);
            this.groupBoxChannelMessages.Size = new System.Drawing.Size(282, 285);
            this.groupBoxChannelMessages.TabIndex = 9;
            this.groupBoxChannelMessages.TabStop = false;
            this.groupBoxChannelMessages.Text = "Channel Messages";
            // 
            // labelBuildNumber
            // 
            this.labelBuildNumber.AutoSize = true;
            this.labelBuildNumber.ForeColor = System.Drawing.SystemColors.ButtonShadow;
            this.labelBuildNumber.Location = new System.Drawing.Point(14, 526);
            this.labelBuildNumber.Name = "labelBuildNumber";
            this.labelBuildNumber.Size = new System.Drawing.Size(50, 13);
            this.labelBuildNumber.TabIndex = 10;
            this.labelBuildNumber.Text = "Build No.";
            // 
            // notifyIconSPOTSMQ
            // 
            this.notifyIconSPOTSMQ.Icon = ((System.Drawing.Icon)(resources.GetObject("notifyIconSPOTSMQ.Icon")));
            this.notifyIconSPOTSMQ.Text = "SPOTS MQ Client";
            this.notifyIconSPOTSMQ.MouseDoubleClick += new System.Windows.Forms.MouseEventHandler(this.notifyIconSPOTSMQ_MouseDoubleClick);
            // 
            // groupBox1
            // 
            this.groupBox1.BackColor = System.Drawing.SystemColors.Control;
            this.groupBox1.Controls.Add(this.checkBoxEnableDeSerializerTest);
            this.groupBox1.Controls.Add(this.labelDeSerializerDisplay);
            this.groupBox1.Controls.Add(this.textBoxInputXML);
            this.groupBox1.Controls.Add(this.buttonDeserialize);
            this.groupBox1.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.groupBox1.Location = new System.Drawing.Point(523, 12);
            this.groupBox1.Margin = new System.Windows.Forms.Padding(2, 3, 2, 3);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Padding = new System.Windows.Forms.Padding(2, 3, 2, 3);
            this.groupBox1.Size = new System.Drawing.Size(515, 211);
            this.groupBox1.TabIndex = 8;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "DeSerializer Test";
            // 
            // labelDeSerializerDisplay
            // 
            this.labelDeSerializerDisplay.AutoSize = true;
            this.labelDeSerializerDisplay.Location = new System.Drawing.Point(6, 135);
            this.labelDeSerializerDisplay.Name = "labelDeSerializerDisplay";
            this.labelDeSerializerDisplay.Size = new System.Drawing.Size(47, 13);
            this.labelDeSerializerDisplay.TabIndex = 8;
            this.labelDeSerializerDisplay.Text = "Ready...";
            // 
            // textBoxInputXML
            // 
            this.textBoxInputXML.BackColor = System.Drawing.SystemColors.HighlightText;
            this.textBoxInputXML.Enabled = false;
            this.textBoxInputXML.Location = new System.Drawing.Point(9, 32);
            this.textBoxInputXML.Margin = new System.Windows.Forms.Padding(2, 3, 2, 3);
            this.textBoxInputXML.Multiline = true;
            this.textBoxInputXML.Name = "textBoxInputXML";
            this.textBoxInputXML.Size = new System.Drawing.Size(498, 97);
            this.textBoxInputXML.TabIndex = 7;
            this.textBoxInputXML.Text = resources.GetString("textBoxInputXML.Text");
            // 
            // buttonDeserialize
            // 
            this.buttonDeserialize.Enabled = false;
            this.buttonDeserialize.Location = new System.Drawing.Point(262, 135);
            this.buttonDeserialize.Margin = new System.Windows.Forms.Padding(2, 3, 2, 3);
            this.buttonDeserialize.Name = "buttonDeserialize";
            this.buttonDeserialize.Size = new System.Drawing.Size(245, 62);
            this.buttonDeserialize.TabIndex = 6;
            this.buttonDeserialize.Text = "Deserialize";
            this.buttonDeserialize.UseVisualStyleBackColor = true;
            this.buttonDeserialize.Click += new System.EventHandler(this.buttonDeserialize_Click);
            // 
            // checkBoxEnableDeSerializerTest
            // 
            this.checkBoxEnableDeSerializerTest.AutoSize = true;
            this.checkBoxEnableDeSerializerTest.Location = new System.Drawing.Point(427, 9);
            this.checkBoxEnableDeSerializerTest.Name = "checkBoxEnableDeSerializerTest";
            this.checkBoxEnableDeSerializerTest.Size = new System.Drawing.Size(83, 17);
            this.checkBoxEnableDeSerializerTest.TabIndex = 9;
            this.checkBoxEnableDeSerializerTest.Text = "Enable Test";
            this.checkBoxEnableDeSerializerTest.UseVisualStyleBackColor = true;
            this.checkBoxEnableDeSerializerTest.CheckedChanged += new System.EventHandler(this.checkBoxEnableDeSerializerTest_CheckedChanged);
            // 
            // labelMQConfig
            // 
            this.labelMQConfig.AutoSize = true;
            this.labelMQConfig.ForeColor = System.Drawing.SystemColors.ButtonShadow;
            this.labelMQConfig.Location = new System.Drawing.Point(529, 251);
            this.labelMQConfig.MaximumSize = new System.Drawing.Size(400, 0);
            this.labelMQConfig.Name = "labelMQConfig";
            this.labelMQConfig.Size = new System.Drawing.Size(57, 13);
            this.labelMQConfig.TabIndex = 11;
            this.labelMQConfig.Text = "MQ Config";
            // 
            // MqDashboard
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1049, 554);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.labelMQConfig);
            this.Controls.Add(this.labelBuildNumber);
            this.Controls.Add(this.groupBoxChannelMessages);
            this.Controls.Add(this.groupBoxMQSendTest);
            this.Controls.Add(this.groupBoxMQController);
            this.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Margin = new System.Windows.Forms.Padding(2, 3, 2, 3);
            this.MaximizeBox = false;
            this.Name = "MqDashboard";
            this.Text = "IDMS MQ Dashboard";
            this.FormClosed += new System.Windows.Forms.FormClosedEventHandler(this.MQ_Dashboard_FormClosed);
            this.Load += new System.EventHandler(this.MQ_Dashboard_Load);
            this.Resize += new System.EventHandler(this.MqDashboard_Resize);
            this.groupBoxMQController.ResumeLayout(false);
            this.groupBoxMQController.PerformLayout();
            this.groupBoxMQSendTest.ResumeLayout(false);
            this.groupBoxMQSendTest.PerformLayout();
            this.groupBoxChannelMessages.ResumeLayout(false);
            this.groupBoxChannelMessages.PerformLayout();
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button buttonStartMQController;
        private System.Windows.Forms.TextBox textBoxAuditDisplay;
        private System.Windows.Forms.Button buttonSend;
        private System.Windows.Forms.TextBox textBoxSendMessage;
        private System.Windows.Forms.TextBox textBoxChannelMessageEvent;
        private System.Windows.Forms.Button buttonStopMQController;
        private System.Windows.Forms.GroupBox groupBoxMQController;
        private System.Windows.Forms.GroupBox groupBoxMQSendTest;
        private System.Windows.Forms.GroupBox groupBoxChannelMessages;
        private System.Windows.Forms.Label labelBuildNumber;
        private System.Windows.Forms.NotifyIcon notifyIconSPOTSMQ;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.TextBox textBoxInputXML;
        private System.Windows.Forms.Button buttonDeserialize;
        private System.Windows.Forms.Label labelDeSerializerDisplay;
        private System.Windows.Forms.CheckBox checkBoxEnableDeSerializerTest;
        private System.Windows.Forms.Label labelMQConfig;
    }
}

