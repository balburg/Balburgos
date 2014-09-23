'API DE LINKEDIN

'AUTENTIFICACION OAUTH2


Function Obtener_tokenFinal(ByVal Token As String) As String
        ' se obtiene el token mediante la uilizacion de un webservice
        Dim uri As String = "https://www.linkedin.com/uas/oauth2/accessToken?grant_type=authorization_code" & _
                                "&code=" & Token & _
                                "&redirect_uri=" & url_redirect & _
                                "&client_id=" & clave_api & _
                                "&client_secret=" & secreto_api



        Dim peticion As HttpWebRequest = HttpWebRequest.Create(uri)

        Dim respuesta As HttpWebResponse = peticion.GetResponse
        Using sr As New StreamReader(respuesta.GetResponseStream)
            Me.datos_url = sr.ReadToEnd
        End Using

        Dim parametros As String() = Split(datos_url, "access_token"":""")
        Dim access_token = parametros(1).Replace("""}", "")

        Return access_token

    End Function
	
	'GET
 Sub ObtenerGrupos(ByVal NuevoToken As String)
        Try

            '========================== OBTENER LOS GRUPOS ASOCIADOS A LA CUENTA ==========================

            Dim publicacion_grupo As HttpWebRequest = HttpWebRequest.Create("https://api.linkedin.com/v1/people/~/group-memberships:(group:(id,name,short-description,small-logo-url,site-group-url))" & _
                        "?count=500&start=0and&oauth2_access_token=" & nuevoToken)
            ' se solicita los grupos a los que pertenece l usuario
            Dim respuesta As HttpWebResponse
            ' en la respuesta del webservice d likedin obtendremos un xml con los grupos

            respuesta = publicacion_grupo.GetResponse
            Dim doc As New XmlDocument
            Using sr2 As StreamReader = New StreamReader(respuesta.GetResponseStream)
                doc.LoadXml(sr2.ReadToEnd)
            End Using
            ' vamos navegando por el xml e identificando cada grupo para añadirlo al arbol de grupos

            Dim nodo As XmlNode
            Dim lista_nodos As XmlNodeList

            lista_nodos = doc.SelectNodes("/group-memberships/group-membership/group")

            Me.TreeGrupos.Nodes.Clear()

            Dim NombreGrupo As String
            Dim idGrupo As Integer
            Dim UrlImagen As String
            Dim Url As String

            For Each nodo In lista_nodos

                NombreGrupo = IIf(nodo.ChildNodes.Item(1).InnerText = Nothing, "", nodo.ChildNodes.Item(1).InnerText)
                If NombreGrupo.Length > 80 Then
                    NombreGrupo = NombreGrupo.Substring(0, 80) & "..."
                End If
                idGrupo = IIf(nodo.ChildNodes.Item(0).InnerText = Nothing, "", nodo.ChildNodes.Item(0).InnerText)
                If nodo.ChildNodes.Count > 3 Then

                    If nodo.ChildNodes.Item(3).InnerText.EndsWith(".png") Then
                        UrlImagen = nodo.ChildNodes.Item(3).InnerText
                    Else
                        UrlImagen = "./Imagenes/NoImages.jpg"
                    End If
                Else
                    UrlImagen = "./Imagenes/NoImages.jpg"
                End If

                If nodo.ChildNodes.Count > 4 Then
                    Url = IIf(nodo.ChildNodes.Item(4).InnerText = "", "", nodo.ChildNodes.Item(4).InnerText)
                Else
                    Url = ""
                End If


                Dim node As New TreeNode
                node.Text = " <img alt='' src='" + UrlImagen + " ' width='75px' height='35px' border='0' />&nbsp;&nbsp;" & NombreGrupo & " - " & idGrupo
                node.Value = ""
                node.NavigateUrl = Url
                node.Target = "_blank"

                Me.TreeGrupos.Nodes.Add(node)

                Me.TreeGrupos.Nodes(Me.TreeGrupos.Nodes.Count - 1).ToolTip = nodo.ChildNodes.Item(2).InnerText

               

            Next
            Me.lblCountGrupos.Text = "Tus grupos (" & lista_nodos.Count & ")"

        Catch ex As Exception
            Me.lblError.Text = "Error en la función ObtenerGrupos():" & ex.Message.ToString()
            Me.lblError.Visible = True
        End Try
    End Sub
	
	'POST
ub PublicarGrupo(ByVal access_token As String)
        Try

            Dim idgrupo As String = ""
            Dim NombreGrupo As String = ""
            Dim Grupo As Array
            Dim Enlace As String = ""
            If Me.txtEnlace.Text.Length > 0 Then
                Enlace = Replace(Replace(Me.txtEnlace.Text, "<", ""), ">", "")
            End If
            Dim TxtEnlace As String = ""

            ' Hacemos un bucle para el caso de seleccionar mas de un grupo
            For i As Integer = 0 To Me.TreeGrupos.CheckedNodes.Count - 1
                NombreGrupo = Me.TreeGrupos.CheckedNodes.Item(i).Text
                Grupo = NombreGrupo.Split("-")
                idgrupo += Grupo(1)

                If Enlace.Length > 0 Then
                    TxtEnlace = "<content><submitted-url>" & Enlace & "</submitted-url><submitted-image-url>" & Enlace & "</submitted-image-url><title>" & Enlace & "</title><description>" & Enlace & "</description></content>"
                Else
                    TxtEnlace = ""
                End If

                'Publicar en un grupo de Linkedin

                Dim content_xml As String = "<?xml version='1.0' encoding='UTF-8'?><post><title>" & Session("Titulo") & "</title><summary>" & Session("Texto") & "</summary>" & TxtEnlace & "</post>"

                Dim publicacion_grupo As HttpWebRequest = HttpWebRequest.Create("https://api.linkedin.com/v1/groups/" & LTrim(RTrim(idgrupo)) & "/posts?oauth2_access_token=" & access_token)

                publicacion_grupo.ContentType = "text/xml"
                publicacion_grupo.Method = "POST"
                Dim codificar As UTF8Encoding = New UTF8Encoding()
                Dim bytes As Byte() = codificar.GetBytes(content_xml)
                publicacion_grupo.ContentLength = bytes.Length

                Dim stm As Stream
                stm = publicacion_grupo.GetRequestStream()
                stm.Write(bytes, 0, bytes.Length)
                stm.Close()

                'Publicar en Twitter
                If ChkTwitter.Checked Then
                    PublicarTwitter(access_token)
                End If

                Dim POST_Grupos As HttpWebRequest = HttpWebRequest.Create("https://api.linkedin.com/v1/groups/" & LTrim(RTrim(idgrupo)) & "/posts?order=recency&category=discussion&oauth2_access_token=" & access_token)
                'introducimos en la query al webservice la id del grupo deseado

                Dim respuestaIdGrupo As HttpWebResponse
                'en la respuesta del webservice d likedin obtendremos un xml con los grupos
                'Trata el XML
                respuestaIdGrupo = POST_Grupos.GetResponse
                Dim docPost As New XmlDocument
                Using srP As StreamReader = New StreamReader(respuestaIdGrupo.GetResponseStream)
                    docPost.LoadXml(srP.ReadToEnd)
                End Using

                ' vamos navegando por el xml e identificando cada grupo para añadirlo al arbol de grupos
                Dim nodo As XmlNode
                Dim lista_nodos As XmlNodeList
                lista_nodos = docPost.SelectNodes("/posts/post")
                Me.TreeGrupos.Nodes.Clear()
                Dim idPost As String

                'Esto igual no hace falta
                Dim contador As Integer = 0
                For Each nodo In lista_nodos
                    If contador = 0 Then
                        idPost = IIf(nodo.ChildNodes.Item(0).InnerText = Nothing, "", nodo.ChildNodes.Item(0).InnerText)
                    End If
                    contador = contador + 1
                Next
                'Puede que baste con esto
                'idPost = IIf(nodo.ChildNodes.Item(0).InnerText = Nothing, "", nodo.ChildNodes.Item(0).InnerText)


            




                marcarPost(access_token, idPost)

               


                PanMensajeFin.Visible = True
                Me.lblMensajeFin.Text = "Solicitud publicada correctamente."
                Me.PanNuevaLinkedin.Visible = False

            Next

        Catch ex As Exception
            Me.lblError.Text = "Error en PublicarGrupo(): " & ex.Message.ToString()
            Me.lblError.Visible = True
        End Try

    End Sub
	
	'PUT
	
	Sub marcarPost(ByVal access_token As String, ByVal idP As String)

        Dim body As String = "<?xml version='1.0' encoding='UTF-8'?><code>job</code>"

        Dim flagasjob As HttpWebRequest = HttpWebRequest.Create("https://api.linkedin.com/v1/posts/" & idP & "/category/code?oauth2_access_token=" & access_token)


        flagasjob.ContentType = "text/xml"
        flagasjob.Method = "PUT"

        Dim codificarFlag As UTF8Encoding = New UTF8Encoding()
        Dim bytesFlag As Byte() = codificarFlag.GetBytes(body)
        flagasjob.ContentLength = bytesFlag.Length

        Dim stmFlag As Stream
        stmFlag = flagasjob.GetRequestStream()
        stmFlag.Write(bytesFlag, 0, bytesFlag.Length)
        stmFlag.Close()

    End Sub
	
	
	
	
	
	
	

